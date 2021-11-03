import React from "react";
import { CommitteeSet } from "src/Model/CommitteeSet";
import { SolvedCommittee } from "src/Model/SolvedCommittee";

type SolutionTableProps = {
  committees: CommitteeSet;
};

function SolutionTable({ committees }: SolutionTableProps) {
  const assignmentsList = (assignments: any) => (
    <React.Fragment>
      {assignments
        .filter((assignment: any) => assignment.assignedPerson)
        .map((assignment: any) => (
          <td
            role="cell"
            data-label="Assignments"
            key={assignment.assignedPerson.name}
          >
            {assignment.assignedPerson.name}
          </td>
        ))}
    </React.Fragment>
  );

  return (
    <table
      className="pf-c-table pf-m-compact pf-m-grid-md"
      role="grid"
      aria-label="Solution"
      id="table-basic"
    >
      <thead>
        <tr role="row">
          <th role="columnheader" scope="col">
            Evaluated Person
          </th>
          <th role="columnheader" scope="col">
            Timeslot
          </th>
          <th role="columnheader" scope="col">
            Assignments
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.values(committees.committees).map(
          (committee: SolvedCommittee) => (
            <tr role="row" key={committee.id}>
              <td role="cell" data-label="Evaluated Person">
                {committee.evaluatedPerson?.name}
              </td>

              <td role="cell" data-label="Timeslot">
                {committee.assignments[0]?.timeSlot?.name}
              </td>
              {assignmentsList(committee.assignments)}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default SolutionTable;
