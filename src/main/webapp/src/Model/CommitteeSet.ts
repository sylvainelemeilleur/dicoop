import { CommitteeAssignment, CommitteeSolution } from "src/api";
import { v4 as uuid } from "uuid";
import { SolvedCommittee } from "./SolvedCommittee";

interface SolvedCommitteeDictionary {
  [index: number]: SolvedCommittee;
}

export class CommitteeSet {
  public id: string;
  public committees: SolvedCommitteeDictionary;
  public date: Date;

  constructor() {
    this.id = uuid();
    this.committees = {};
    this.date = new Date();
  }

  public add(committee: SolvedCommittee) {
    this.committees[committee.id] = committee;
  }

  static fromCommitteeSolution(solution: CommitteeSolution): CommitteeSet {
    return (
      solution.committeeAssignments?.reduce(
        (set: CommitteeSet, a: CommitteeAssignment) => {
          const committeeId = a.committee?.id ?? uuid();
          set.committees[committeeId] =
            set.committees[committeeId] ||
            new SolvedCommittee(committeeId, a.committee?.evaluatedPerson);
          set.committees[committeeId].assignments.push(a);
          return set;
        },
        new CommitteeSet()
      ) ?? new CommitteeSet()
    );
  }
}
