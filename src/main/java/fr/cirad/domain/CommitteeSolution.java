package fr.cirad.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.base.Strings;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardmediumsoft.HardMediumSoftScore;
import org.optaplanner.core.api.solver.SolverStatus;

@PlanningSolution
public class CommitteeSolution {

    @PlanningId
    public UUID id;

    @ProblemFactCollectionProperty
    @JsonIgnore
    public List<Committee> committees;

    @ProblemFactCollectionProperty
    @JsonIgnore
    @ValueRangeProvider(id = "personRange")
    public List<Person> persons;

    @ProblemFactCollectionProperty
    @JsonIgnore
    public List<TimeSlot> timeSlots;

    @PlanningEntityCollectionProperty
    public List<CommitteeAssignment> committeeAssignments;

    @PlanningScore
    public HardMediumSoftScore score = null;

    public String scoreExplanation = "";

    // Ignored by OptaPlanner, used by the UI to display solve or stop solving
    // button
    public SolverStatus solverStatus;

    public CommitteeSolution() {
        // must have a no-args constructor so it can be constructed by OptaPlanner
    }

    public CommitteeSolution(UUID id, SolverOptions options) {
        this.id = id;
        this.persons = options.participants;

        // set range option for each participant and also travelling distance constraint
        this.persons.stream().forEach(p -> {
            p.numberOfAssignmentsRangeConstraint = getNumberOfAssignmentsRange(p, options.settings);
            p.travellingDistanceRangeConstraint = options.settings.travellingDistanceRange;
        });

        this.timeSlots = this.persons.stream().flatMap(person -> person.availability.stream())
                .filter(timeSlot -> !Strings.isNullOrEmpty(timeSlot.name)).distinct()
                .collect(Collectors.toList());

        // Committees based on persons required skills
        this.committees = this.persons.stream().filter(person -> person.needsEvaluation)
                .map(person -> new Committee(person, options.settings))
                .collect(Collectors.toList());

        // initialization of the Committees assignments needed (professionals, non-professionals and
        // externals)
        this.committeeAssignments = new ArrayList<>();
        Long committeeAssignmentId = 0L;
        for (var committee : this.committees) {
            for (int i = 1; i <= options.settings.nbProParticipants.getMax(); i++) {
                this.committeeAssignments.add(new CommitteeAssignment(committeeAssignmentId++,
                        committee,
                        PersonType.PROFESSIONAL, options.settings.distanceMatrix));
            }
            for (int i = 1; i <= options.settings.nbNonProParticipants.getMax(); i++) {
                this.committeeAssignments.add(new CommitteeAssignment(committeeAssignmentId++,
                        committee,
                        PersonType.NON_PROFESSIONAL, options.settings.distanceMatrix));
            }
            for (int i = 1; i <= options.settings.nbExternalParticipants.getMax(); i++) {
                this.committeeAssignments.add(new CommitteeAssignment(committeeAssignmentId++,
                        committee,
                        PersonType.EXTERNAL, options.settings.distanceMatrix));
            }
        }

        // Optional shuffling of the participants
        if (Boolean.TRUE.equals(options.settings.shuffleParticipants)) {
            // No need to use strong randomness, as the shuffling is only done once
            // Devskim: ignore DS148264
            Collections.shuffle(this.persons);
        }
    }

    public Optional<Committee> getCommitteeByEvaluatedPersonName(String personName) {
        return this.committees.stream()
                .filter(committee -> committee.evaluatedPerson.name.equals(personName)).findFirst();
    }

    public Optional<Person> getPersonByName(String personName) {
        return this.persons.stream().filter(person -> person.name.equals(personName)).findFirst();
    }

    private Range getNumberOfAssignmentsRange(Person person, Settings settings) {
        if (person.personType.equals(PersonType.PROFESSIONAL))
            return settings.numberOfAssignmentsForAProfessional;
        else if (person.personType.equals(PersonType.NON_PROFESSIONAL))
            return settings.numberOfAssignmentsForANonProfessional;
        else if (person.personType.equals(PersonType.EXTERNAL))
            return settings.numberOfAssignmentsForAnExternal;
        else
            return new Range(0, 5);
    }
}
