package fr.cirad.domain;

import java.util.Comparator;
import org.optaplanner.core.api.domain.lookup.PlanningId;

public class PersonType implements Comparable<PersonType> {

    @PlanningId
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
        if (!(o instanceof PersonType)) {
            return false;
        }
        PersonType other = (PersonType) o;
        return this.name.equalsIgnoreCase(other.name);
    }

    @Override
    public int hashCode() {
        return this.name.hashCode();
    }

    @Override
    public String toString() {
        return "PersonType: " + name;
    }

}
