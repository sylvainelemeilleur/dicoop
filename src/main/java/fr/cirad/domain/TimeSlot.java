package fr.cirad.domain;

import java.util.Comparator;

public class TimeSlot implements Comparable<TimeSlot> {

    public String name;

    private static final Comparator<TimeSlot> COMPARATOR = Comparator.comparing(ts -> ts.name);

    public TimeSlot() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public TimeSlot(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(TimeSlot o) {
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
