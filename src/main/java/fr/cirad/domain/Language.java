package fr.cirad.domain;

import java.util.Comparator;
import org.optaplanner.core.api.domain.lookup.PlanningId;

public class Language implements Comparable<Language> {

    @PlanningId
    public String name;

    private static final Comparator<Language> COMPARATOR = Comparator.comparing(l -> l.name);

    public Language() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Language(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(Language o) {
        return COMPARATOR.compare(this, o);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Language)) {
            return false;
        }
        Language other = (Language) o;
        return this.name.equalsIgnoreCase(other.name);
    }

    @Override
    public int hashCode() {
        return this.name.hashCode();
    }

    @Override
    public String toString() {
        return "Language: " + name;
    }

}
