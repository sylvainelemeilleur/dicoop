import { CommitteeAssignment, CommitteeSolution } from "src/api";
import { SolvedCommitteeDictionary } from "./SolvedCommitteeDictionary";

export class Solution {
  constructor(
    public id: string,
    public committeeAssignments: Array<CommitteeAssignment>,
    public committees: SolvedCommitteeDictionary,
    public solverStatus: string,
    public score: string,
    public scoreExplanation: string
  ) {}

  public static fromCommitteeSolution = (
    solution: CommitteeSolution
  ): Solution => {
    const committees =
      solution.committeeAssignments?.reduce(
        (r: SolvedCommitteeDictionary, a: CommitteeAssignment) => {
          const committeeId = a.committee?.id ?? -1;
          r[committeeId] = r[committeeId] || {
            id: committeeId,
            evaluatedPerson: a.committee?.evaluatedPerson,
            assignments: [],
          };
          r[committeeId].assignments.push(a);
          return r;
        },
        Object.create(null)
      ) ?? {};
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
