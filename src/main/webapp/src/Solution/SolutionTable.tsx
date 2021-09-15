import React from "react";

function SolutionTable(props: any) {
  const assignmentsList = (assignments: any) => (
    <ul>
      {assignments
        .filter((assignment: any) => assignment.assignedPerson)
        .map((assignment: any) => (
          <li key={assignment.assignedPerson.name}>
            Required {assignment.requiredPersonType.name}:
            <b>{assignment.assignedPerson.name}</b> (
            {assignment.assignedPerson.personType.name}) (
            {assignment.timeSlot.name})
          </li>
        ))}
    </ul>
  );

  return (
    <table
      className="pf-c-table pf-m-grid-md"
      role="grid"
      aria-label="Solution"
      id="table-basic"
    >
      <caption>
        Solution status: {props.committeeSolution.solverStatus}
        <br />
        Score: <br />
        {props.committeeSolution.score}
        <br />
        ID: {props.committeeSolution.id}
        <div>Score explanation: {props.committeeSolution.scoreExplanation}</div>
      </caption>
      <thead>
        <tr role="row">
          <th role="columnheader" scope="col">
            Evaluated Person
          </th>
          <th role="columnheader" scope="col">
            Assignments
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {Object.values(props.committeeSolution.committees).map(
          (committee: any) => (
            <tr role="row" key={committee.id}>
              <td role="cell" data-label="Evaluated Person">
                {committee.evaluatedPerson?.name}
              </td>
              <td role="cell" data-label="Assignments">
                {assignmentsList(committee.assignments)}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default SolutionTable;
