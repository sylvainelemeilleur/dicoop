package fr.cirad.domain;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class Committee {

    public UUID id = UUID.randomUUID();

    public Person evaluatedPerson;

    public Instant createdDate = Instant.now();

    public Committee() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Committee(Person evaluatedPerson) {
        this.evaluatedPerson = evaluatedPerson;
    }

    public boolean atLeastOnePersonIsAvailable(List<CommitteeAssignment> assignments) {
        return assignments.stream().map(CommitteeAssignment::getAssignedPerson)
                .anyMatch(p -> p.isAvailable(evaluatedPerson.availability));
    }

    @Override
    public String toString() {
        return "Committee for: " + this.evaluatedPerson;
    }

}
