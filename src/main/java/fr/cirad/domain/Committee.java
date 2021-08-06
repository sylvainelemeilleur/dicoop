package fr.cirad.domain;

import java.time.Instant;
import org.optaplanner.core.api.domain.lookup.PlanningId;

public class Committee {

    @PlanningId
    public Long id;

    public Person evaluatedPerson;

    public Instant createdDate = Instant.now();

    private static Long currentId = 0L; // Fake ID generator for the demo

    public Committee() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Committee(Person evaluatedPerson) {
        this.id = currentId++;
        this.evaluatedPerson = evaluatedPerson;
    }

    @Override
    public String toString() {
        return "Committee: " + id;
    }

}
