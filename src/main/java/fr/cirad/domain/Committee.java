package fr.cirad.domain;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public class Committee implements Comparable<Committee> {

    public UUID id = UUID.randomUUID();

    public Person evaluatedPerson;

    public Instant createdDate = Instant.now();

    private Boolean useAvailability = true;

    private Settings settings;

    private static final Comparator<Committee> COMPARATOR = Comparator.comparing(c -> c.id);

    public Committee() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Committee(Person evaluatedPerson, Settings settings) {
        this.evaluatedPerson = evaluatedPerson;
        this.settings = settings;
        this.useAvailability = settings.useAvailability;
    }

    public boolean atLeastOnePersonIsAvailable(List<CommitteeAssignment> assignments) {
        if (Boolean.FALSE.equals(useAvailability)) {
            return true;
        }
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

    private boolean metMinimumAssignmentsByPersonType(List<CommitteeAssignment> assignments,
            PersonType personType, int minimum) {
        long numberOfPersonsOfThisType = assignments.stream()
                .filter(a -> a.getAssignedPerson().personType.equals(personType)).count();
        return (numberOfPersonsOfThisType >= minimum);
    }

    public boolean metMinimumAssignments(List<CommitteeAssignment> assignments) {
        return metMinimumAssignmentsByPersonType(assignments, PersonType.PROFESSIONAL,
                settings.nbProParticipants.getMin())
                && metMinimumAssignmentsByPersonType(assignments, PersonType.NON_PROFESSIONAL,
                        settings.nbNonProParticipants.getMin())
                && metMinimumAssignmentsByPersonType(assignments, PersonType.EXTERNAL,
                        settings.nbExternalParticipants.getMin());
    }

    @Override
    public String toString() {
        return "Committee for: " + this.evaluatedPerson;
    }

    @Override
    public int compareTo(Committee o) {
        return COMPARATOR.compare(this, o);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Committee)) {
            return false;
        }
        Committee other = (Committee) o;
        return this.id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return this.id.hashCode();
    }

}
