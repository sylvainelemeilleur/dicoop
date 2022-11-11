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
                                minAssignmentsByCommittee(constraintFactory),
                                inspectionRotation(constraintFactory),
                                inspectionFollowUp(constraintFactory), vetoes(constraintFactory),
                                travelling(constraintFactory)};
        }

        private Constraint minimizeEmptySlots(ConstraintFactory constraintFactory) {
                return constraintFactory.forEachIncludingNullVars(CommitteeAssignment.class)
                                .filter(a -> a.assignedPerson == null)
                                .penalize(HardMediumSoftScore.ONE_SOFT)
                                .asConstraint("minimize empty slots");
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
         * committees where at least N persons are available at the same time slot of the evaluated
         * person
         *
         * @param constraintFactory ConstraintFactory
         * @return A Constraint object.
         */
        private Constraint timeSlotConflict(ConstraintFactory constraintFactory) {
                return getCommitteeAssignments(constraintFactory).filter((committee,
                                assignments) -> !committee.atLeastNPersonsPresentAtCommitteeMeeting(
                                                assignments, 2))
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("All persons in a committee are available at the same time slot");
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
                                .penalize(HardMediumSoftScore.ofHard(100))
                                .asConstraint("A person cannot be assigned to its self committee");
        }

        private Constraint committeeConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .join(CommitteeAssignment.class,
                                                equal(CommitteeAssignment::getAssignedPerson),
                                                equal(CommitteeAssignment::getCommittee),
                                                lessThan(CommitteeAssignment::getId))
                                .penalize(HardMediumSoftScore.ofHard(100))
                                .asConstraint("A person cannot be assigned multiple times to the same committee");
        }

        private Constraint maxNumberOfInspections(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(Person::hasMoreAssignmentsThanMaxNumberOfAssignments)
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("Maximum number of inspection per participant");
        }


        private Constraint minNumberOfInspections(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(Person::hasLessAssignmentsThanMinNumberOfAssignments)
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("Minimum number of inspection per participant");
        }

        private Constraint requiredPersonType(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .filter(committeeAssignment -> !committeeAssignment
                                                .isRequiredPersonTypeCorrect())
                                .penalize(HardMediumSoftScore.ofHard(100))
                                .asConstraint("Required person type to certificate");
        }

        private Constraint requiredSkills(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee, assignments) -> !committee
                                                .atLeastOnePersonHasTheRequiredSkills(assignments))
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("At least one person in a committee has the required skills");
        }

        private Constraint nonReciprocity(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .join(Person.class,
                                                equal(ca -> ca.committee.evaluatedPerson, p -> p))
                                .filter((ca, evaluatedPerson) -> evaluatedPerson
                                                .isEvaluating(ca.assignedPerson))
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("Non-reciprocity");
        }

        private Constraint minAssignmentsByCommittee(ConstraintFactory constraintFactory) {
                return constraintFactory.forEachIncludingNullVars(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee,
                                                assignments) -> !committee
                                                                .metMinimumAssignments(assignments))
                                .penalize(HardMediumSoftScore.ONE_MEDIUM)
                                .asConstraint("Minimum number of assignments per committee not met");
        }

        private Constraint inspectionRotation(ConstraintFactory constraintFactory) {
                return getCommitteeAssignments(constraintFactory)
                                .filter((committee, assignments) -> committee
                                                .inspectionRotationBroken(assignments))
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("Inspector rotation not respected");
        }

        private Constraint inspectionFollowUp(ConstraintFactory constraintFactory) {
                return getCommitteeAssignments(constraintFactory)
                                .filter((committee, assignments) -> !committee
                                                .inspectionFollowUpRespected(assignments))
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("Inspector follow up not respected");
        }

        private Constraint vetoes(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class).filter(
                                ca -> ca.assignedPerson.isVetoed(ca.committee.evaluatedPerson))
                                .penalize(HardMediumSoftScore.ONE_HARD).asConstraint("Veto");
        }

        private Constraint travelling(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(Person::isNotTravellingInRange)
                                .penalize(HardMediumSoftScore.ONE_HARD)
                                .asConstraint("Travelling distance range");
        }

}
