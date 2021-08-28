import React, { useEffect, useState } from "react";
import "./App.css";
import "@patternfly/patternfly/patternfly.css";

function App() {
  const [persons, setPersons] = useState([]);
  const [committeeSolution, setCommitteeSolution] = useState({
    committeeAssignments: [],
    committees: {},
    solverStatus: "NOT_STARTED",
    score: "",
    scoreExplanation: "",
  });

  useEffect(() => {
    fetch("/api/persons")
      .then((res) => res.json())
      .then((res) => {
        setPersons(res);
      })
      .catch(console.log);
  }, []);

  const parseSolution = (solution: any) => {
    const committees = solution.committeeAssignments.reduce(
      (r: any, a: any) => {
        r[a.committee.id] = r[a.committee.id] || {
          id: a.committee.id,
          evaluatedPerson: a.committee.evaluatedPerson,
          assignments: [],
        };
        r[a.committee.id].assignments.push(a);
        return r;
      },
      Object.create(null)
    );
    return {
      committees,
      committeeAssignments: solution.committeeAssignments,
      solverStatus: solution.solverStatus,
      score: JSON.stringify(solution.score),
      scoreExplanation: solution.scoreExplanation,
    };
  };

  const startSolving = () => {
    fetch("/api/committeeSolution/solve")
      .then(() => {
        setCommitteeSolution({
          committeeAssignments: [],
          committees: {},
          solverStatus: "INITIALIZING",
          score: "",
          scoreExplanation: "",
        });
        setTimeout(() => {
          refreshSolution();
        }, 2000);
      })
      .catch(console.log);
  };

  const refreshSolution = () => {
    fetch("/api/committeeSolution")
      .then((res) => res.json())
      .then((res) => {
        setCommitteeSolution(parseSolution(res));
        if (res.solverStatus === "SOLVING_ACTIVE") {
          setTimeout(() => {
            refreshSolution();
          }, 2000);
        }
      })
      .catch(console.log);
  };

  const badge = (item: any) => (
    <span key={item} className="pf-c-badge pf-m-read">
      {item}
    </span>
  );

  const assignmentsList = (assignments: any) => (
    <ul>
      {assignments
        .filter((assignment: any) => assignment.assignedPerson)
        .map((assignment: any) => (
          <li key={assignment.assignedPerson?.id}>
            {assignment.assignedPerson?.name}
          </li>
        ))}
    </ul>
  );

  return (
    <div className="App">
      <button
        className="pf-c-button pf-m-primary"
        type="button"
        onClick={startSolving}
      >
        Solve
      </button>
      <table
        className="pf-c-table pf-m-grid-md"
        role="grid"
        aria-label="Solution"
        id="table-basic"
      >
        <caption>
          Solution status: {committeeSolution.solverStatus} score:{" "}
          {committeeSolution.score}
          <div>Score explanation: {committeeSolution.scoreExplanation}</div>
        </caption>
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col">
              Committee ID
            </th>
            <th role="columnheader" scope="col">
              Evaluated Person
            </th>
            <th role="columnheader" scope="col">
              Assignments
            </th>
          </tr>
        </thead>
        {Object.values(committeeSolution.committees).map((committee: any) => (
          <tbody role="rowgroup" key={committee.id}>
            <tr role="row">
              <td role="cell" data-label="Committee ID">
                {committee.id}
              </td>
              <td role="cell" data-label="Evaluated Person">
                {committee.evaluatedPerson?.name}
              </td>
              <td role="cell" data-label="Assignments">
                {assignmentsList(committee.assignments)}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <table
        className="pf-c-table pf-m-grid-md"
        role="grid"
        aria-label="Participants"
        id="table-basic"
      >
        <caption>Participants</caption>
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col">
              Name
            </th>
            <th role="columnheader" scope="col">
              Type
            </th>
            <th role="columnheader" scope="col">
              Location
            </th>
            <th role="columnheader" scope="col">
              Skills
            </th>
            <th role="columnheader" scope="col">
              Languages
            </th>
            <th role="columnheader" scope="col">
              Availability
            </th>
            <th role="columnheader" scope="col">
              Skills to certificate
            </th>
          </tr>
        </thead>
        {persons.map((person: any) => (
          <tbody role="rowgroup" key={person.name}>
            <tr role="row">
              <td role="cell" data-label="Name">
                {person.name}
              </td>
              <td role="cell" data-label="Type">
                {person.personType.name}
              </td>
              <td role="cell" data-label="Location">
                {person.location.name}
              </td>
              <td role="cell" data-label="Skills">
                {person.skills.map((skill: any) => badge(skill.name))}
              </td>
              <td role="cell" data-label="Languages">
                {person.languages.map((language: any) => badge(language.name))}
              </td>
              <td role="cell" data-label="Availability">
                {person.availability.map((availability: any) =>
                  badge(availability.name)
                )}
              </td>
              <td role="cell" data-label="Skills to certificate">
                {person.skillsToCertificate.map((skill: any) =>
                  badge(skill.name)
                )}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default App;
