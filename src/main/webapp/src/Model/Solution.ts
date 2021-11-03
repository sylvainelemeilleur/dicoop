import { CommitteeAssignment, CommitteeSolution } from "src/api";
import { CommitteeSet } from "./CommitteeSet";

export class Solution {
  constructor(
    public id: string,
    public committeeAssignments: Array<CommitteeAssignment>,
    public committees: CommitteeSet,
    public solverStatus: string,
    public score: string,
    public scoreExplanation: string
  ) {}

  public static fromCommitteeSolution = (
    solution: CommitteeSolution
  ): Solution => {
    const committees = CommitteeSet.fromCommitteeSolution(solution);
    return new Solution(
      solution.id ?? "ID_UNDEFINED",
      solution.committeeAssignments ?? [],
      committees,
      solution.solverStatus ?? "STATUS_UNDEFINED",
      JSON.stringify(solution.score),
      solution.scoreExplanation ?? "SCORE_EXPLANATION_UNDEFINED"
    );
  };
}
