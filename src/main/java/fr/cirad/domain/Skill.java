package fr.cirad.domain;

import java.util.Comparator;
import org.optaplanner.core.api.domain.lookup.PlanningId;

public class Skill implements Comparable<Skill> {

    @PlanningId
    public String name;

    private static final Comparator<Skill> COMPARATOR = Comparator.comparing(s -> s.name);

    public Skill() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Skill(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(Skill o) {
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

}
