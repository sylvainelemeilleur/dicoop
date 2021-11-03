import React from "react";
import { Solution } from "src/Model/Solution";
import { SolvedCommittee } from "src/Model/SolvedCommittee";

type SolutionTableProps = {
  committeeSolution: Solution;
};

function SolutionTable({ committeeSolution }: SolutionTableProps) {
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
            <b>{assignment.assignedPerson.name}</b>
            <br />({assignment.assignedPerson.personType.name})
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
        {Object.values(committeeSolution.committees.committees).map(
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
