package fr.cirad.domain;

import java.util.Comparator;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
public class CommitteeAssignment implements Comparable<CommitteeAssignment> {

    @PlanningVariable(valueRangeProviderRefs = {"personRange"})
    public Person assignedPerson;

    public Committee committee;

    public PersonType requiredPersonType;

    private static final Comparator<CommitteeAssignment> COMPARATOR =
            Comparator.comparing((CommitteeAssignment ca) -> ca.assignedPerson)
                    .thenComparing(ca -> ca.committee);

    public CommitteeAssignment() {
        // must have a no-args constructor so it can be constructed by OptaPlanner
    }

    public CommitteeAssignment(Committee committee, PersonType requiredPersonType) {
        this.committee = committee;
        this.requiredPersonType = requiredPersonType;
    }

    @Override
    public int compareTo(CommitteeAssignment o) {
        return COMPARATOR.compare(this, o);
    }

    @Override
    public boolean equals(Object o) {
        return COMPARATOR.equals(o);
    }

    @Override
    public int hashCode() {
        return COMPARATOR.hashCode();
    }

}
