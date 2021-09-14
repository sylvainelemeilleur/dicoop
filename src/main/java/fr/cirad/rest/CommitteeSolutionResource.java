package fr.cirad.rest;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.jboss.logging.Logger;
import org.optaplanner.core.api.score.ScoreManager;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.solver.SolverManager;
import org.optaplanner.core.api.solver.SolverStatus;
import fr.cirad.bootstrap.DemoDataService;
import fr.cirad.domain.CommitteeSolution;
import net.jodah.expiringmap.ExpiringMap;

@Path("api/committeeSolution")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommitteeSolutionResource {

    static Map<UUID, CommitteeSolution> solutions =
            ExpiringMap.builder().maxSize(50).expiration(1, TimeUnit.DAYS).build();

    @Inject
    SolverManager<CommitteeSolution, UUID> solverManager;

    @Inject
    ScoreManager<CommitteeSolution, HardSoftScore> scoreManager;

    @Inject
    DemoDataService service;

    @Inject
    Logger log;

    @GET
    @Path("/{id}")
    public CommitteeSolution getSolution(@PathParam(value = "id") UUID id) {
        // Get the solver status before loading the solution
        // to avoid the race condition that the solver terminates between them
        SolverStatus solverStatus = getSolverStatus(id);
        CommitteeSolution solution = findById(id);
        scoreManager.updateScore(solution); // Sets the score
        solution.solverStatus = solverStatus;
        var scoreExplanation = scoreManager.explainScore(solution);
        log.info(scoreExplanation);
        solution.scoreExplanation = scoreExplanation.toString();
        return solution;
    }

    @GET
    @Path("solve")
    public CommitteeSolution solve() {
        var solution = initSolution();
        solverManager.solveAndListen(solution.id, this::findById, this::save);
        return solution;
    }

    @GET
    @Path("stopSolving/{id}")
    public String stopSolving(@PathParam(value = "id") UUID id) {
        solverManager.terminateEarly(id);
        return "The solving solution " + id + " has been terminated.";
    }

    CommitteeSolution initSolution() {
        var solution = new CommitteeSolution(service.committees, service.persons, service.skills,
                service.timeSlots, service.assignments);
        solutions.put(solution.id, solution);
        return solution;
    }

    SolverStatus getSolverStatus(UUID id) {
        return solverManager.getSolverStatus(id);
    }

    @Transactional
    CommitteeSolution findById(UUID id) {
        if (!solutions.containsKey(id)) {
            throw new IllegalStateException("There is no solution with id (" + id + ").");
        }
        return solutions.get(id);
    }

    @Transactional
    void save(CommitteeSolution solution) {
        solutions.put(solution.id, solution);
    }
}
