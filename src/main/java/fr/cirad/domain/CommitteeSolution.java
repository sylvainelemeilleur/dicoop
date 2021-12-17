package fr.cirad.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.base.Strings;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.solver.SolverStatus;

@PlanningSolution
public class CommitteeSolution {

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
    public List<Skill> skills;

    @ProblemFactCollectionProperty
    @JsonIgnore
    @ValueRangeProvider(id = "timeSlotRange")
    public List<TimeSlot> timeSlots;

    @PlanningEntityCollectionProperty
    public List<CommitteeAssignment> committeeAssignments;

    @PlanningScore
    public HardSoftScore score = null;

    public String scoreExplanation = "";

    // Ignored by OptaPlanner, used by the UI to display solve or stop solving
    // button
    public SolverStatus solverStatus;

    public CommitteeSolution() {
        // No-arg constructor required for OptaPlanner
    }

    public CommitteeSolution(SolverOptions options) {
        this.id = UUID.randomUUID();
        this.persons = options.participants;

        // set range option for each participant and also travelling distance constraint
        this.persons.stream().forEach(
                p -> {
                    p.numberOfAssignmentsRangeConstraint =
                            getNumberOfAssignmentsRange(p, options.settings);
                    p.travellingDistanceRangeConstraint = options.settings.travellingDistanceRange;
                });

        this.skills = this.persons.stream().flatMap(person -> person.skills.stream())
                .filter(skill -> !Strings.isNullOrEmpty(skill.name)).distinct()
                .collect(Collectors.toList());
        this.timeSlots = this.persons.stream().flatMap(person -> person.availability.stream())
                .filter(timeSlot -> !Strings.isNullOrEmpty(timeSlot.name)).distinct()
                .collect(Collectors.toList());

        // Committees based on persons skills to certificate
        this.committees = this.persons.stream()
                .filter(person -> person.needsEvaluation)
                .map(Committee::new).collect(Collectors.toList());
        this.committeeAssignments = new ArrayList<>();

        // initialization of the Committees assignments needed (professionals, non-professionals and
        // externals)
        for (var committee : this.committees) {
            for (int i = 1; i <= options.settings.nbProParticipants; i++) {
                this.committeeAssignments
                        .add(new CommitteeAssignment(committee, PersonType.PROFESSIONAL,
                                options.settings.distanceMatrix));
            }
            for (int i = 1; i <= options.settings.nbNonProParticipants; i++) {
                this.committeeAssignments
                        .add(new CommitteeAssignment(committee, PersonType.NON_PROFESSIONAL,
                                options.settings.distanceMatrix));
            }
            for (int i = 1; i <= options.settings.nbExternalParticipants; i++) {
                this.committeeAssignments
                        .add(new CommitteeAssignment(committee, PersonType.EXTERNAL,
                                options.settings.distanceMatrix));
            }
        }
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
