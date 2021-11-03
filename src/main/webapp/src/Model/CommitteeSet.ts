import { CommitteeAssignment, CommitteeSolution } from "src/api";
import { SolvedCommittee } from "./SolvedCommittee";

interface SolvedCommitteeDictionary {
  [index: number]: SolvedCommittee;
}

export class CommitteeSet {
  public committees: SolvedCommitteeDictionary;
  public date: Date;

  constructor() {
    this.committees = {};
    this.date = new Date();
  }

  static fromCommitteeSolution(solution: CommitteeSolution): CommitteeSet {
    return (
      solution.committeeAssignments?.reduce(
        (set: CommitteeSet, a: CommitteeAssignment) => {
          const committeeId = a.committee?.id ?? -1;
          set.committees[committeeId] = set.committees[committeeId] || {
            id: committeeId,
            evaluatedPerson: a.committee?.evaluatedPerson,
            assignments: [],
          };
          set.committees[committeeId].assignments.push(a);
          return set;
        },
        new CommitteeSet()
      ) ?? new CommitteeSet()
    );
  }
}
