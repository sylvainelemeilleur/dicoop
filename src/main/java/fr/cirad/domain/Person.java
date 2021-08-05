package fr.cirad.domain;

import java.util.Comparator;
import java.util.List;

public class Person implements Comparable<Person> {

    public String name;

    public PersonType personType;

    public List<Skill> skills;

    public Location location;

    public List<Language> languages;

    public List<TimeSlot> availability;

    public List<Skill> skillsToCertificate;

    private static final Comparator<Person> COMPARATOR = Comparator.comparing(p -> p.name);

    public Person() {
        // No-arg constructor required for Hibernate and OptaPlanner
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
    }

    public boolean hasAtListOneSkill(List<Skill> skills) {
        return this.skills.stream().anyMatch(skills::contains);
    }

    @Override
    public int compareTo(Person o) {
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

    @Override
    public String toString() {
        return "Person: " + name;
    }

}
