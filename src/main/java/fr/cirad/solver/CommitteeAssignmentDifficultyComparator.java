package fr.cirad.solver;

import java.util.Comparator;
import fr.cirad.domain.CommitteeAssignment;

public class CommitteeAssignmentDifficultyComparator implements Comparator<CommitteeAssignment> {

    @Override
    public int compare(CommitteeAssignment ca1, CommitteeAssignment ca2) {
        if (ca1 == null || ca2 == null) {
            return 0;
        }
        return ca1.getCorrectnessScore() - ca2.getCorrectnessScore();
    }

}
