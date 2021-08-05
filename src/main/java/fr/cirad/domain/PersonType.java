package fr.cirad.domain;

import java.util.Comparator;

public class PersonType implements Comparable<PersonType> {

    public String name;

    private static final Comparator<PersonType> COMPARATOR = Comparator.comparing(pt -> pt.name);

    public PersonType() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public PersonType(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(PersonType o) {
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
        return "PersonType: " + name;
    }

}
