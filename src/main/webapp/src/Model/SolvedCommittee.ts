import { CommitteeAssignment, Person } from "src/api";

export class SolvedCommittee {
  constructor(
    public id: string,
    public evaluatedPerson?: Person,
    public assignments: Array<CommitteeAssignment> = new Array<CommitteeAssignment>()
  ) {}
}
