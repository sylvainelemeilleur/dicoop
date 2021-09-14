package fr.cirad.domain;

import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    // Ignored by OptaPlanner, used by the UI to display solve or stop solving button
    public SolverStatus solverStatus;

    public CommitteeSolution() {
        // No-arg constructor required for OptaPlanner
    }

    public CommitteeSolution(List<Committee> committees, List<Person> persons, List<Skill> skills,
            List<TimeSlot> timeSlots, List<CommitteeAssignment> committeeAssignments) {
        this.id = UUID.randomUUID();
        this.committees = committees;
        this.persons = persons;
        this.skills = skills;
        this.timeSlots = timeSlots;
        this.committeeAssignments = committeeAssignments;
    }
}
