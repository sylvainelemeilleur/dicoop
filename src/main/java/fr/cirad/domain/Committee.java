package fr.cirad.domain;

import java.time.Instant;
import java.util.List;

public class Committee {

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

    public boolean allPersonsAreAvailable(List<CommitteeAssignment> assignments) {
        return assignments.stream().map(CommitteeAssignment::getTimeSlot).distinct().count() <= 1;
    }

    @Override
    public String toString() {
        return "Committee: " + id;
    }

}
