package fr.cirad.domain;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
public class CommitteeAssignment {

    @PlanningVariable(valueRangeProviderRefs = { "personRange" })
    public Person person;

    @PlanningVariable(valueRangeProviderRefs = { "timeSlotRange" })
    public TimeSlot timeSlot;

    public Committee committee;

    public Skill skill;

}
