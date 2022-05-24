package fr.cirad.solver;

import static org.optaplanner.core.api.score.stream.ConstraintCollectors.toList;
import static org.optaplanner.core.api.score.stream.Joiners.equal;
import static org.optaplanner.core.api.score.stream.Joiners.lessThan;
import java.util.List;
import java.util.function.Function;
import org.optaplanner.core.api.score.buildin.hardmediumsoft.HardMediumSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.bi.BiConstraintStream;
import fr.cirad.domain.Committee;
import fr.cirad.domain.CommitteeAssignment;
import fr.cirad.domain.Person;

public class CommitteeSchedulingConstraintProvider implements ConstraintProvider {

        @Override
        public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
                return new Constraint[] {minimizeEmptySlots(constraintFactory),
                                timeSlotConflict(constraintFactory),
                                selfConflict(constraintFactory),
                                committeeConflict(constraintFactory),
                                maxNumberOfInspections(constraintFactory),
                                minNumberOfInspections(constraintFactory),
                                requiredPersonType(constraintFactory),
                                requiredSkills(constraintFactory),
                                nonReciprocity(constraintFactory),
                                oneCommonLanguage(constraintFactory),
                                minAssignmentsByCommittee(constraintFactory),
                                inspectionRotation(constraintFactory),
                                inspectionFollowUp(constraintFactory), vetoes(constraintFactory),
                                travelling(constraintFactory)
                };
        }

        private Constraint minimizeEmptySlots(ConstraintFactory constraintFactory) {
                return constraintFactory.forEachIncludingNullVars(CommitteeAssignment.class)
                                .filter(a -> a.assignedPerson == null)
                                .penalize("minimize empty slots", HardMediumSoftScore.ONE_SOFT);
        }

        /**
         * "For each committee, join it with all committee assignments, and group the assignments by
         * committee."
         *
         * The first line of the function is a call to `forEach(Committee.class)`. This creates a
         * `BiConstraintStream` that iterates over all committees
         *
         * @param constraintFactory The constraint factory that will be used to create the
         *        constraint.
         * @return A stream of committee assignments.
         */
        private BiConstraintStream<Committee, List<CommitteeAssignment>> getCommitteeAssignments(
                        ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Committee.class).join(
                                constraintFactory.forEachIncludingNullVars(
                                                CommitteeAssignment.class),
                                equal(Function.identity(), CommitteeAssignment::getCommittee))
                                .groupBy((committee, assignment) -> committee,
                                                toList((committee, assignment) -> assignment));
        }

        /**
         * For each committee, group the committee assignments by committee, and filter out the
         * committees where at least one person is available at the same time slot of the evaluated
         * person
         *
         * @param constraintFactory ConstraintFactory
         * @return A Constraint object.
         */
        private Constraint timeSlotConflict(ConstraintFactory constraintFactory) {
                return getCommitteeAssignments(constraintFactory)
                                .filter((committee,
                                                assignments) -> !committee
                                                                .allAssignedPersonsHaveAnAvailabilityInCommon(
                                                                                assignments))
                                .penalize("All persons in a committee are available at the same time slot",
                                                HardMediumSoftScore.ONE_HARD);
        }

        /**
         * A person cannot be assigned to its self committee
         *
         * @param constraintFactory The constraint factory is a factory that creates constraints.
         * @return A Constraint
         */
        private Constraint selfConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class).filter(
                                committeeAssignment -> committeeAssignment.assignedPerson.equals(
                                                committeeAssignment.committee.evaluatedPerson))
                                .penalize("A person cannot be assigned to its self committee",
                                                HardMediumSoftScore.ofHard(100));
        }

        private Constraint committeeConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class).join(
                                CommitteeAssignment.class,
                                equal(CommitteeAssignment::getAssignedPerson),
                                equal(CommitteeAssignment::getCommittee),
                                lessThan(CommitteeAssignment::getId))
                                .penalize("A person cannot be assigned multiple times to the same committee",
                                                HardMediumSoftScore.ofHard(100));
        }

        private Constraint maxNumberOfInspections(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(Person::hasMoreAssignmentsThanMaxNumberOfAssignments)
                                .penalize("Maximum number of inspection per participant",
                                                HardMediumSoftScore.ONE_HARD);
        }


        private Constraint minNumberOfInspections(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(Person::hasLessAssignmentsThanMinNumberOfAssignments)
                                .penalize("Minimum number of inspection per participant",
                                                HardMediumSoftScore.ONE_HARD);
        }

        private Constraint requiredPersonType(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .filter(committeeAssignment -> !committeeAssignment
                                                .isRequiredPersonTypeCorrect())
                                .penalize("Required person type to certificate",
                                                HardMediumSoftScore.ofHard(100));
        }

        private Constraint requiredSkills(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee, assignments) -> !committee
                                                .atLeastOnePersonHasTheRequiredSkills(assignments))
                                .penalize("At least one person in a committee has the required skills",
                                                HardMediumSoftScore.ONE_HARD);
        }

        private Constraint nonReciprocity(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .join(Person.class,
                                                equal(ca -> ca.committee.evaluatedPerson, p -> p))
                                .filter((ca, evaluatedPerson) -> evaluatedPerson
                                                .isEvaluating(ca.assignedPerson))
                                .penalize("Non-reciprocity", HardMediumSoftScore.ONE_HARD);
        }

        private Constraint oneCommonLanguage(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .groupBy(ca -> ca.committee, toList())
                                .filter((committee, assignments) -> {
                                        // if the language of the assigned person is undefined,
                                        // return false
                                        if (committee.evaluatedPerson.languages.isEmpty()) {
                                                return false;
                                        }
                                        for (var lang : committee.evaluatedPerson.languages) {
                                                if (assignments.stream()
                                                                .anyMatch(a -> a.assignedPerson
                                                                                .hasLanguage(lang)))
                                                        return false;
                                        }
                                        return true;
                                }).penalize("One common language", HardMediumSoftScore.ONE_HARD);
        }

        private Constraint minAssignmentsByCommittee(ConstraintFactory constraintFactory) {
                return constraintFactory.forEachIncludingNullVars(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee,
                                                assignments) -> !committee
                                                                .metMinimumAssignments(assignments))
                                .penalize("Minimum number of assignments per committee not met",
                                                HardMediumSoftScore.ONE_MEDIUM);
        }

        private Constraint inspectionRotation(ConstraintFactory constraintFactory) {
                return getCommitteeAssignments(constraintFactory)
                                .filter((committee, assignments) -> committee
                                                .inspectionRotationBroken(assignments))
                                .penalize("Inspector rotation not respected",
                                                HardMediumSoftScore.ONE_HARD);
        }

        private Constraint inspectionFollowUp(ConstraintFactory constraintFactory) {
                return getCommitteeAssignments(constraintFactory)
                                .filter((committee, assignments) -> !committee
                                                .inspectionFollowUpRespected(assignments))
                                .penalize("Inspector follow up not respected",
                                                HardMediumSoftScore.ONE_HARD);
        }

        private Constraint vetoes(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class).filter(
                                ca -> ca.assignedPerson.isVetoed(ca.committee.evaluatedPerson))
                                .penalize("Veto", HardMediumSoftScore.ONE_HARD);
        }

        private Constraint travelling(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(Person::isNotTravellingInRange)
                                .penalize("Travelling distance range",
                                                HardMediumSoftScore.ONE_HARD);
        }

}
