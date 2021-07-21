package fr.cirad.domain;

import java.util.List;

import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardsoftlong.HardSoftLongScore;
import org.optaplanner.core.api.solver.SolverStatus;

@PlanningSolution
public class CommitteeSolution {

    @ProblemFactCollectionProperty
    public List<Committee> committees;

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "personRange")
    public List<Person> persons;

    @ProblemFactCollectionProperty
    public List<Skill> skills;

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "timeSlotRange")
    public List<TimeSlot> timeSlots;

    @PlanningEntityCollectionProperty
    private List<CommitteeAssignment> committeeAssignments;

    @PlanningScore
    public HardSoftLongScore score = null;

    // Ignored by OptaPlanner, used by the UI to display solve or stop solving button
    public SolverStatus solverStatus;

    public CommitteeSolution() {
        // No-arg constructor required for OptaPlanner
    }

    public CommitteeSolution(List<Committee> committees, List<Person> persons, List<Skill> skills, List<TimeSlot> timeSlots) {
        this.committees = committees;
        this.persons = persons;
        this.skills = skills;
        this.timeSlots = timeSlots;
    }
}
