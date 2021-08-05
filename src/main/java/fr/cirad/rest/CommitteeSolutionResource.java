package fr.cirad.rest;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.optaplanner.core.api.score.ScoreManager;
import org.optaplanner.core.api.score.buildin.hardsoftlong.HardSoftLongScore;
import org.optaplanner.core.api.solver.SolverManager;
import org.optaplanner.core.api.solver.SolverStatus;
import fr.cirad.bootstrap.DemoDataService;
import fr.cirad.domain.Committee;
import fr.cirad.domain.CommitteeSolution;

@Path("api/committeeSolution")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommitteeSolutionResource {

    public static final Long SINGLETON_TIME_TABLE_ID = 1L;

    @Inject
    SolverManager<CommitteeSolution, Long> solverManager;

    @Inject
    ScoreManager<CommitteeSolution, HardSoftLongScore> scoreManager;

    @Inject
    DemoDataService service;

    @GET
    public CommitteeSolution getSolution() {
        // Get the solver status before loading the solution
        // to avoid the race condition that the solver terminates between them
        SolverStatus solverStatus = getSolverStatus();
        CommitteeSolution solution = findById(SINGLETON_TIME_TABLE_ID);
        scoreManager.updateScore(solution); // Sets the score
        solution.solverStatus = solverStatus;
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
    protected CommitteeSolution findById(Long id) {
        if (!SINGLETON_TIME_TABLE_ID.equals(id)) {
            throw new IllegalStateException("There is no timeTable with id (" + id + ").");
        }
        return new CommitteeSolution(service.committees, service.persons, service.skills,
                service.timeSlots, service.assignments);
    }

    @Transactional
    protected void save(CommitteeSolution committeeSolution) {
        for (Committee committee : committeeSolution.committees) {
            // TODO if we have to save the solution
            // this is awfully naive: optimistic locking causes issues if called by the
            // SolverManager
        }
    }
}
