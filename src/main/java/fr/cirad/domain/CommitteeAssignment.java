package fr.cirad.domain;

import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;
import fr.cirad.solver.CommitteeAssignmentDifficultyComparator;
import fr.cirad.solver.PersonStrengthComparator;

@PlanningEntity(difficultyComparatorClass = CommitteeAssignmentDifficultyComparator.class)
public class CommitteeAssignment {

    @PlanningId
    @JsonIgnore
    public UUID id = UUID.randomUUID();

    @PlanningVariable(valueRangeProviderRefs = {"personRange"},
            strengthComparatorClass = PersonStrengthComparator.class)
    public Person assignedPerson;

    public Committee committee;

    public PersonType requiredPersonType;

    @JsonIgnore
    public DistanceMatrix distanceMatrix;

    public CommitteeAssignment() {
        // must have a no-args constructor so it can be constructed by OptaPlanner
    }

    public CommitteeAssignment(Person assignedPerson, Committee committee,
            PersonType requiredPersonType, DistanceMatrix distanceMatrix) {
        this.assignedPerson = assignedPerson;
        this.committee = committee;
        this.requiredPersonType = requiredPersonType;
        this.distanceMatrix = distanceMatrix;
    }

    public CommitteeAssignment(Committee committee, PersonType requiredPersonType,
            DistanceMatrix distanceMatrix) {
        this.committee = committee;
        this.requiredPersonType = requiredPersonType;
        this.distanceMatrix = distanceMatrix;
    }

    public Person getAssignedPerson() {
        return assignedPerson;
    }

    public Committee getCommittee() {
        return committee;
    }

    @JsonIgnore
    public Integer getDistance() {
        if (assignedPerson.isInternalNullPerson()) {
            return 0;
        }
        return distanceMatrix.getDistance(assignedPerson.location.name,
                committee.evaluatedPerson.location.name);
    }

    @JsonIgnore
    public int getCorrectnessScore() {
        if (assignedPerson == null || assignedPerson.isInternalNullPerson()) {
            return 0;
        }
        int score = 0;
        if (assignedPerson.personType.equals(requiredPersonType))
            score += 1;
        if (committee.atLeastOnePersonIsAvailable(List.of(this)))
            score += 1;
        if (committee.atLeastOnePersonHasTheRequiredSkills(List.of(this)))
            score += 1;
        return score;
    }

    @JsonIgnore
    public boolean isRequiredPersonTypeCorrect() {
        if (assignedPerson.isInternalNullPerson()) {
            return true;
        }
        return assignedPerson.personType.equals(requiredPersonType);
    }

    @Override
    public String toString() {
        return " CommitteeAssignment: " + assignedPerson + " for " + committee;
    }

}
