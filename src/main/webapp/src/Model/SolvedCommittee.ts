import { CommitteeAssignment, Person } from "src/api";

export class SolvedCommittee {
  constructor(
    public id: number,
    public evaluatedPerson: Person,
    public assignments: Array<CommitteeAssignment>
  ) {}
}
