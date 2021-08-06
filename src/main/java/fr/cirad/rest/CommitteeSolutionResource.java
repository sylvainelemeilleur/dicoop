package fr.cirad.rest;

import java.util.UUID;
import java.util.concurrent.ExecutionException;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.optaplanner.core.api.score.ScoreManager;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.solver.SolverJob;
import org.optaplanner.core.api.solver.SolverManager;
import org.optaplanner.core.api.solver.SolverStatus;
import fr.cirad.bootstrap.DemoDataService;
import fr.cirad.domain.CommitteeSolution;

@Path("api/committeeSolution")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommitteeSolutionResource {

    public static final UUID SINGLETON_TIME_TABLE_ID = UUID.randomUUID();
    public CommitteeSolution currentSolution;

    @Inject
    SolverManager<CommitteeSolution, UUID> solverManager;

    @Inject
    ScoreManager<CommitteeSolution, HardSoftScore> scoreManager;

    @Inject
    DemoDataService service;

    @GET
    public CommitteeSolution getSolution() {
        if (currentSolution == null) {
            currentSolution = new CommitteeSolution(service.committees, service.persons,
                    service.skills, service.timeSlots, service.assignments);
        }
        // Get the solver status before loading the solution
        // to avoid the race condition that the solver terminates between them
        SolverStatus solverStatus = getSolverStatus();
        CommitteeSolution solution = findById(SINGLETON_TIME_TABLE_ID);
        scoreManager.updateScore(solution); // Sets the score
        solution.solverStatus = solverStatus;
        return solution;
    }

    @POST
    @Path("solve2")
    public CommitteeSolution solve2() {
        UUID problemId = UUID.randomUUID();
        CommitteeSolution problem = new CommitteeSolution(service.committees, service.persons,
                service.skills, service.timeSlots, service.assignments);
        SolverJob<CommitteeSolution, UUID> solverJob = solverManager.solve(problemId, problem);
        CommitteeSolution solution;
        try {
            solution = solverJob.getFinalBestSolution();
        } catch (InterruptedException | ExecutionException e) {
            throw new IllegalStateException("Solving failed.", e);
        }
        return solution;
    }

    @POST
    @Path("solve")
    public void solve() {
        solverManager.solveAndListen(SINGLETON_TIME_TABLE_ID, this::findById, this::save);
    }

    public SolverStatus getSolverStatus() {
        return solverManager.getSolverStatus(SINGLETON_TIME_TABLE_ID);
    }

    @POST
    @Path("stopSolving")
    public void stopSolving() {
        solverManager.terminateEarly(SINGLETON_TIME_TABLE_ID);
    }

    @Transactional
    protected CommitteeSolution findById(UUID id) {
        if (!SINGLETON_TIME_TABLE_ID.equals(id)) {
            throw new IllegalStateException("There is no timeTable with id (" + id + ").");
        }
        return currentSolution;
    }

    @Transactional
    protected void save(CommitteeSolution committeeSolution) {
        currentSolution = committeeSolution;
    }
}
