import { CommitteeAssignment, Person } from "src/api";

export class SolvedCommittee {
  constructor(
    public id: string,
    public evaluatedPerson?: Person,
    public assignments: Array<CommitteeAssignment> = new Array<CommitteeAssignment>()
  ) {}
  findFirstTimeslotInCommon(): string {
    const timeslots = this.assignments
      .flatMap((assignment) => assignment.assignedPerson?.availability)
      .map((t) => t?.name ?? "");
    for (const t of this.evaluatedPerson?.availability ?? []) {
      if (t.name && timeslots.includes(t.name)) {
        return t.name;
      }
    }
    return "";
  }
}
