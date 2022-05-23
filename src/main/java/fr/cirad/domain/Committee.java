package fr.cirad.domain;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import org.optaplanner.core.api.domain.lookup.PlanningId;

public class Committee implements Comparable<Committee> {

    @PlanningId
    public String id;

    public Person evaluatedPerson;

    public Instant createdDate = Instant.now();

    private Boolean useAvailability = true;

    private Settings settings;

    private static final Comparator<Committee> COMPARATOR =
            Comparator.comparing(c -> c.evaluatedPerson);

    public Committee(Person evaluatedPerson, Settings settings) {
        this.id = evaluatedPerson.name;
        this.evaluatedPerson = evaluatedPerson;
        this.settings = settings;
        this.useAvailability = settings.useAvailability;
    }

    public boolean atLeastOnePersonIsAvailable(List<CommitteeAssignment> assignments) {
        if (Boolean.FALSE.equals(useAvailability)) {
            return true;
        }
        for (CommitteeAssignment assignment : assignments) {
            if (assignment.assignedPerson != null
                    && assignment.assignedPerson.isAvailable(evaluatedPerson.availability)) {
                return true;
            }
        }
        return false;
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

    public boolean inspectionRotationBroken(List<CommitteeAssignment> assignments) {
        for (CommitteeAssignment assignment : assignments) {
            if (assignment.assignedPerson != null
                    && assignment.assignedPerson.hasAlreadyInspectedInThePast(evaluatedPerson)) {
                return true;
            }
        }
        return false;
    }

    public boolean inspectionFollowUpRespected(List<CommitteeAssignment> assignments) {
        long nbFollowUp =
                assignments.stream()
                        .filter(a -> a.assignedPerson != null
                                && a.assignedPerson.hasAlreadyInspectedLastTime(evaluatedPerson))
                        .count();
        return nbFollowUp == settings.nbInspectorsFollowingUp;
    }

    @Override
    public String toString() {
        return "Committee for: " + this.evaluatedPerson + " (" + this.id + ")";
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
        return this.evaluatedPerson.equals(other.evaluatedPerson);
    }

    @Override
    public int hashCode() {
        return this.evaluatedPerson.hashCode();
    }

}
