package fr.cirad.domain;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
public class CommitteeAssignment {

    @PlanningId
    public Long id;

    @PlanningVariable(valueRangeProviderRefs = {"personRange"})
    public Person assignedPerson;

    @PlanningVariable(valueRangeProviderRefs = {"timeSlotRange"})
    public TimeSlot timeSlot;

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

    public Person getAssignedPerson() {
        return assignedPerson;
    }

    public Committee getCommittee() {
        return committee;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public boolean isRequiredPersonTypeCorrect() {
        if (assignedPerson == null || requiredPersonType == null)
            return false;
        return assignedPerson.personType.equals(requiredPersonType);
    }

    public boolean isAvailable() {
        if (assignedPerson == null)
            return false;
        return assignedPerson.availability.contains(timeSlot);
    }

    @Override
    public String toString() {
        return " CommitteeAssignment " + id + " " + assignedPerson + " " + committee;
    }

}
