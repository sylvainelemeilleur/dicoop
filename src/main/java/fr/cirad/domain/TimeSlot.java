package fr.cirad.domain;

import java.util.Comparator;
import org.optaplanner.core.api.domain.lookup.PlanningId;

public class TimeSlot implements Comparable<TimeSlot> {

    @PlanningId
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
        if (!(o instanceof TimeSlot)) {
            return false;
        }
        TimeSlot other = (TimeSlot) o;
        return this.name.equals(other.name);
    }

    @Override
    public int hashCode() {
        return this.name.hashCode();
    }

}
