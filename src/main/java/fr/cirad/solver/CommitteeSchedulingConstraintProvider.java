package fr.cirad.solver;

import java.util.List;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import fr.cirad.domain.CommitteeAssignment;
import fr.cirad.domain.Skill;

public class CommitteeSchedulingConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
        return new Constraint[] {requiredPersonType(constraintFactory),
                requiredSkillsToCertificate(constraintFactory)};
    }

    private Constraint requiredPersonType(ConstraintFactory constraintFactory) {
        return constraintFactory.from(CommitteeAssignment.class).filter(committeeAssignment -> {
            return !committeeAssignment.assignedPerson.personType
                    .equals(committeeAssignment.requiredPersonType);
        }).penalize("Required person type to certificate", HardSoftScore.ONE_HARD);
    }

    private Constraint requiredSkillsToCertificate(ConstraintFactory constraintFactory) {
        return constraintFactory.from(CommitteeAssignment.class).filter(committeeAssignment -> {
            List<Skill> skillsToCertificate =
                    committeeAssignment.committee.evaluatedPerson.skillsToCertificate;
            return !committeeAssignment.assignedPerson.hasAtListOneSkill(skillsToCertificate);
        }).penalize("Required skills to certificate", HardSoftScore.ONE_HARD);
    }

}
