package fr.cirad.domain;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.InverseRelationShadowVariable;

@PlanningEntity
public class Person implements Comparable<Person> {

    @JsonIgnore
    public static final Person NULL_PERSON = new Person("INTERNAL_NULL_PERSON",
            PersonType.UNDEFINED, List.of(), null, List.of(), List.of(), List.of());

    @PlanningId
    public String name;

    public PersonType personType;

    public List<Skill> skills;

    public Location location;

    public List<Language> languages;

    public List<TimeSlot> availability;

    public List<Skill> requiredSkills;

    public Boolean needsEvaluation;

    public List<Person> vetoes;

    public List<String> hasAlreadyInspected;

    public Long maxNumberOfInspections;

    @InverseRelationShadowVariable(sourceVariableName = "assignedPerson")
    @JsonIgnore
    public List<CommitteeAssignment> assignments;

    @JsonIgnore
    public Range numberOfAssignmentsRangeConstraint = new Range(0, 5);

    @JsonIgnore
    public Range travellingDistanceRangeConstraint = new Range(0, 100);

    private static final Comparator<Person> COMPARATOR = Comparator.comparing(p -> p.name);

    public Person() {
        assignments = new ArrayList<>();
    }

    public Person(String name) {
        this.name = name;
        assignments = new ArrayList<>();
    }

    public Person(String name, PersonType personType, List<Skill> skills, Location location,
            List<Language> languages, List<TimeSlot> availability) {
        this(name, personType, skills, location, languages, availability, List.of());
    }

    public Person(String name, PersonType personType, List<Skill> skills, Location location,
            List<Language> languages, List<TimeSlot> availability,
            List<Skill> requiredSkills) {
        this.name = name;
        this.personType = personType;
        this.skills = skills;
        this.location = location;
        this.languages = languages;
        this.availability = availability;
        this.requiredSkills = requiredSkills;
        this.assignments = new ArrayList<>();
        this.vetoes = new ArrayList<>();
        this.hasAlreadyInspected = new ArrayList<>();
    }

    public boolean isInternalNullPerson() {
        return this.equals(NULL_PERSON);
    }

    // Checks if a person has more assignments than the maximum number of assignments
    public boolean hasMoreAssignmentsThanMaxNumberOfAssignments() {
        // checks if maxNumberOfInspections is null
        if (maxNumberOfInspections == null || isInternalNullPerson()) {
            return false;
        }
        return assignments.size() > maxNumberOfInspections;
    }

    public int getNumberOfAssignments() {
        return assignments.size();
    }

    // Checks if the person has the language
    public boolean hasLanguage(Language language) {
        return languages.contains(language);
    }

    // Checks if the person has one of the skills
    public boolean hasSkill(Skill skill) {
        return this.skills.contains(skill);
    }

    // Checks if a person is evaluated by this person
    public boolean isEvaluating(Person other) {
        return this.assignments.stream().anyMatch(a -> a.committee.evaluatedPerson.equals(other));
    }

    // Checks if a person is available at given time slots
    public boolean isAvailable(List<TimeSlot> timeSlots) {
        return timeSlots.stream().anyMatch(t -> availability.contains(t));
    }

    // Checks if two persons are on veto each other
    public boolean isVetoed(Person other) {
        return vetoes.contains(other) || other.vetoes.contains(this);
    }

    // Checks if the number of assignments is in the range
    public boolean assignmentsAreInRange() {
        if (isInternalNullPerson())
            return true;
        return numberOfAssignmentsRangeConstraint.contains(assignments.size());
    }

    @Override
    public int compareTo(Person o) {
        return COMPARATOR.compare(this, o);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Person)) {
            return false;
        }
        Person other = (Person) o;
        return this.name.equalsIgnoreCase(other.name);
    }

    @Override
    public int hashCode() {
        return this.name.hashCode();
    }

    @Override
    public String toString() {
        return "Person: " + name;
    }

}
