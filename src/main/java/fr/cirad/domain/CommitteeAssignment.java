package fr.cirad.domain;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
public class CommitteeAssignment /* implements Comparable<CommitteeAssignment> */ {

    @PlanningId
    public Long id;

    @PlanningVariable(valueRangeProviderRefs = {"personRange"})
    public Person assignedPerson;

    public Committee committee;

    public PersonType requiredPersonType;

    public CommitteeAssignment() {
        // must have a no-args constructor so it can be constructed by OptaPlanner
    }

    public CommitteeAssignment(Long id, Committee committee, PersonType requiredPersonType) {
        this.id = id;
        this.committee = committee;
        this.requiredPersonType = requiredPersonType;
    }

    @Override
    public String toString() {
        return " CommitteeAssignment " + id + " " + assignedPerson + " " + committee;
    }

}
