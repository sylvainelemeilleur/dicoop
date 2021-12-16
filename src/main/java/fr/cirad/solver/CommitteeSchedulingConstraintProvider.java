package fr.cirad.solver;

import static org.optaplanner.core.api.score.stream.ConstraintCollectors.toList;
import static org.optaplanner.core.api.score.stream.Joiners.equal;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import fr.cirad.domain.CommitteeAssignment;
import fr.cirad.domain.Person;

public class CommitteeSchedulingConstraintProvider implements ConstraintProvider {

        @Override
        public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
                return new Constraint[] {
                                timeSlotConflict(constraintFactory),
                                selfConflict(constraintFactory),
                                committeeConflict(constraintFactory),
                                committeeAssignmentsConflict(constraintFactory),
                                requiredPersonType(constraintFactory),
                                requiredSkills(constraintFactory),
                                nonReciprocity(constraintFactory),
                                oneCommonLanguage(constraintFactory),
                                inspectionRotation(constraintFactory), vetoes(constraintFactory)};
        }

        private Constraint timeSlotConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee,
                                                assignments) -> !committee
                                                                .atLeastOnePersonIsAvailable(
                                                                                assignments))
                                .penalize("At least one person in a committee is available at the same time slot of the evaluated person",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint selfConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class).filter(
                                committeeAssignment -> committeeAssignment.assignedPerson.equals(
                                                committeeAssignment.committee.evaluatedPerson))
                                .penalize("A person cannot be assigned to its self committee",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint committeeConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEachUniquePair(CommitteeAssignment.class,

                                equal(CommitteeAssignment::getCommittee),
                                equal(CommitteeAssignment::getAssignedPerson))
                                .penalize("A person cannot be assigned multiple times to the same committee",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint committeeAssignmentsConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(Person.class)
                                .filter(person -> !person.numberOfAssignmentsRangeConstraint
                                                .contains(person.assignments.size()))
                                .penalize("Number of assignments  per person",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint requiredPersonType(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .filter(committeeAssignment -> !committeeAssignment
                                                .isRequiredPersonTypeCorrect())
                                .penalize("Required person type to certificate",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint requiredSkills(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee, assignments) -> !committee
                                                .atLeastOnePersonHasTheRequiredSkills(assignments))
                                .penalize("At least one person in a committee has the skills to certificate",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint nonReciprocity(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .join(Person.class,
                                                equal(ca -> ca.committee.evaluatedPerson, p -> p))
                                .filter((ca, evaluatedPerson) -> evaluatedPerson
                                                .isEvaluating(ca.assignedPerson))
                                .penalize("Non-reciprocity", HardSoftScore.ONE_HARD);
        }

        private Constraint oneCommonLanguage(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .groupBy(ca -> ca.committee, toList())
                                .filter((committee, assignments) -> {
                                        for (var lang : committee.evaluatedPerson.languages) {
                                                if (assignments.stream()
                                                                .anyMatch(a -> a.assignedPerson
                                                                                .hasLanguage(lang)))
                                                        return false;
                                        }
                                        return true;
                                }).penalize("One common language", HardSoftScore.ONE_HARD);
        }

        private Constraint inspectionRotation(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class)
                                .filter(ca -> ca.assignedPerson.hasAlreadyInspected.stream()
                                                .anyMatch(name -> ca.committee.evaluatedPerson.name
                                                                .equalsIgnoreCase(name)))
                                .penalize("Inspector rotation", HardSoftScore.ONE_HARD);
        }

        private Constraint vetoes(ConstraintFactory constraintFactory) {
                return constraintFactory.forEach(CommitteeAssignment.class).filter(
                                ca -> ca.assignedPerson.isVetoed(ca.committee.evaluatedPerson))
                                .penalize("Veto", HardSoftScore.ONE_HARD);
        }

}
