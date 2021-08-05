package fr.cirad.domain;

import java.time.Instant;
import java.util.Comparator;

public class Committee implements Comparable<Committee> {

    public Long id;

    public Person evaluatedPerson;

    public Instant createdDate = Instant.now();

    private static Long currentId = 0L; // Fake ID generator for the demo

    public static final Comparator<Committee> COMPARATOR =
            Comparator.comparing((Committee c) -> c.evaluatedPerson);

    public Committee() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Committee(Person evaluatedPerson) {
        this.id = currentId++;
        this.evaluatedPerson = evaluatedPerson;
    }

    @Override
    public int compareTo(Committee o) {
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
