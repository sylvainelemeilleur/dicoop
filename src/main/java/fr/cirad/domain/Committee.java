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

    public boolean atLeastOnePersonHasTheRequiredSkills(List<CommitteeAssignment> assignments) {
        for (Skill skill : evaluatedPerson.requiredSkills) {
            if (assignments.stream().map(CommitteeAssignment::getAssignedPerson)
                    .noneMatch(p -> p.hasSkill(skill))) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String toString() {
        return "Committee for: " + this.evaluatedPerson;
    }

}
