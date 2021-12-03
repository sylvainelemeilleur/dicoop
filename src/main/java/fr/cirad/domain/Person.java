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

    @PlanningId
    public String name;

    public PersonType personType;

    public List<Skill> skills;

    public Location location;

    public List<Language> languages;

    public List<TimeSlot> availability;

    public List<Skill> skillsToCertificate;

    public Boolean needsEvaluation;

    public List<String> hasAlreadyInspected;

    @InverseRelationShadowVariable(sourceVariableName = "assignedPerson")
    @JsonIgnore
    public List<CommitteeAssignment> assignments;

    @JsonIgnore
    public Range numberOfAssignmentsRangeConstraint = new Range(0, 5);

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
            List<Skill> skillsToCertificate) {
        this.name = name;
        this.personType = personType;
        this.skills = skills;
        this.location = location;
        this.languages = languages;
        this.availability = availability;
        this.skillsToCertificate = skillsToCertificate;
        this.assignments = new ArrayList<>();
    }

    // Checks if the person has the language
    public boolean hasLanguage(Language language) {
        return languages.contains(language);
    }

    // Checks if the person has one of the skills
    public boolean hasAtListOneSkill(List<Skill> skills) {
        return this.skills.stream().anyMatch(skills::contains);
    }

    // Checks if a person is evaluated by this person
    public boolean isEvaluating(Person other) {
        return this.assignments.stream().anyMatch(a -> a.committee.evaluatedPerson.equals(other));
    }

    // Checks if a person is available at given time slots
    public boolean isAvailable(List<TimeSlot> timeSlots) {
        return timeSlots.stream().anyMatch(t -> availability.contains(t));
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
