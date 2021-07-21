package fr.cirad.domain;

import java.util.List;


import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.InverseRelationShadowVariable;

@PlanningEntity
public class Person {

    public String name;

    public PersonType personType;

    public List<Skill> skills;

    public Location location;

    public List<Language> languages;

    public List<TimeSlot> availability;

    @InverseRelationShadowVariable(sourceVariableName = "person")
    private List<CommitteeAssignment> committeeAssignments;

    public Person() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Person(String name, PersonType personType, List<Skill> skills, Location location, List<Language> languages, List<TimeSlot> availability) {
        this.name = name;
        this.personType = personType;
        this.skills = skills;
        this.location = location;
        this.languages = languages;
        this.availability = availability;
    }

}
