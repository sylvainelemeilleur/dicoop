package fr.cirad.solver;

import static org.optaplanner.core.api.score.stream.ConstraintCollectors.toList;
import static org.optaplanner.core.api.score.stream.Joiners.equal;
import java.util.List;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import fr.cirad.domain.CommitteeAssignment;
import fr.cirad.domain.Person;
import fr.cirad.domain.Skill;

public class CommitteeSchedulingConstraintProvider implements ConstraintProvider {

        @Override
        public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
                return new Constraint[] {
                                timeSlotConflict(constraintFactory),
                                selfConflict(constraintFactory),
                                committeeConflict(constraintFactory),
                                committeeAssignmentsConflict(constraintFactory),
                                requiredPersonType(constraintFactory),
                                requiredSkillsToCertificate(constraintFactory),
                                nonReciprocity(constraintFactory),
                                oneCommonLanguage(constraintFactory),
                                inspectionRotation(constraintFactory)};
        }

        private Constraint timeSlotConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class)
                                .groupBy(CommitteeAssignment::getCommittee, toList())
                                .filter((committee,
                                                assignments) -> !committee
                                                                .atLeastOnePersonIsAvailable(
                                                                                assignments))
                                .penalize("At least one person in a committee is available at the same time slot of the evaluated person",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint selfConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class).filter(
                                committeeAssignment -> committeeAssignment.assignedPerson.equals(
                                                committeeAssignment.committee.evaluatedPerson))
                                .penalize("A person cannot be assigned to its self committee",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint committeeConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.fromUniquePair(CommitteeAssignment.class,

                                equal(CommitteeAssignment::getCommittee),
                                equal(CommitteeAssignment::getAssignedPerson))
                                .penalize("A person cannot be assigned multiple times to the same committee",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint committeeAssignmentsConflict(ConstraintFactory constraintFactory) {
                return constraintFactory.from(Person.class)
                                .filter(person -> !person.numberOfAssignmentsRangeConstraint
                                                .contains(person.assignments.size()))
                                .penalize("Number of committees per person",
                                                HardSoftScore.ONE_SOFT);
        }

        private Constraint requiredPersonType(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class)
                                .filter(committeeAssignment -> !committeeAssignment
                                                .isRequiredPersonTypeCorrect())
                                .penalize("Required person type to certificate",
                                                HardSoftScore.ONE_HARD);
        }

        private Constraint requiredSkillsToCertificate(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class)
                                .filter(committeeAssignment -> {
                                        List<Skill> skillsToCertificate =
                                                        committeeAssignment.committee.evaluatedPerson.skillsToCertificate;
                                        return !committeeAssignment.assignedPerson
                                                        .hasAtListOneSkill(skillsToCertificate);
                                })
                                .penalize("Required skills to certificate", HardSoftScore.ONE_HARD);
        }

        private Constraint nonReciprocity(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class)
                                .join(Person.class,
                                                equal(ca -> ca.committee.evaluatedPerson, p -> p))
                                .filter((ca, evaluatedPerson) -> evaluatedPerson
                                                .isEvaluating(ca.assignedPerson))
                                .penalize("Non-reciprocity", HardSoftScore.ONE_HARD);
        }

        private Constraint oneCommonLanguage(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class)
                                .groupBy(ca -> ca.committee, toList())
                                .filter((committee, assignments) -> {
                                        for (var lang : committee.evaluatedPerson.languages) {
                                                if (assignments.stream()
                                                                .allMatch(a -> a.assignedPerson
                                                                                .hasLanguage(lang)))
                                                        return true;
                                        }
                                        return false;
                                }).penalize("One common language", HardSoftScore.ONE_HARD);
        }

        private Constraint inspectionRotation(ConstraintFactory constraintFactory) {
                return constraintFactory.from(CommitteeAssignment.class)
                                .filter(ca -> ca.assignedPerson.hasAlreadyInspected.stream()
                                                .anyMatch(name -> ca.committee.evaluatedPerson.name
                                                                .equalsIgnoreCase(name)))
                                .penalize("Inspector rotation", HardSoftScore.ONE_HARD);
        }

}
