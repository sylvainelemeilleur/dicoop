import React from "react";

function SolutionTable(props: any) {
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
          <th role="columnheader" scope="col" colSpan={3}>
            Assignments
          </th>
          <th role="columnheader" scope="col">
            Timeslot
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
              {assignmentsList(committee.assignments)}
              <td role="cell" data-label="Timeslot">
                {committee.assignments[0]?.timeSlot?.name}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default SolutionTable;
