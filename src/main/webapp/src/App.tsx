import React, { useEffect, useState } from 'react'
import './App.css'
import '@patternfly/patternfly/patternfly.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [committeeSolution, setCommitteeSolution] = useState({committeeAssignments:[]});

  useEffect(() => {
    fetch('/api/persons')
      .then(res => res.json())
      .then((res) => { setPersons(res) })
      .catch(console.log);
  }, [])

  useEffect(() => {
    fetch('/api/committeeSolution')
      .then(res => res.json())
      .then((res) => { setCommitteeSolution(res) })
      .catch(console.log);
  }, [])

  const badge = (item: any) => <span key={item} className="pf-c-badge pf-m-read">{item}</span>

  return (
    <div className="App">
      <table className="pf-c-table pf-m-grid-md" role="grid" aria-label="Solution" id="table-basic">
        <caption>Solution</caption>
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col">Committee ID</th>
            <th role="columnheader" scope="col">Evaluated Person</th>
            <th role="columnheader" scope="col">Assigned Person</th>
            <th role="columnheader" scope="col">Assigned Person Type</th>
          </tr>
        </thead>
        {committeeSolution.committeeAssignments.map((assignment: any) => (
          <tbody role="rowgroup" key={assignment.committee.id}>
            <tr role="row">
              <td role="cell" data-label="Committee ID">{assignment.committee.id}</td>
              <td role="cell" data-label="Evaluated Person">{assignment.committee.evaluatedPerson.name}</td>
              <td role="cell" data-label="Assigned Person">{assignment.assignedPerson.name}</td>
              <td role="cell" data-label="Assigned Person Type">{assignment.assignedPerson.personType.name}</td>
            </tr>
          </tbody>
        ))}
      </table>
      <table className="pf-c-table pf-m-grid-md" role="grid" aria-label="Participants" id="table-basic">
        <caption>Participants</caption>
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col">Name</th>
            <th role="columnheader" scope="col">Type</th>
            <th role="columnheader" scope="col">Location</th>
            <th role="columnheader" scope="col">Skills</th>
            <th role="columnheader" scope="col">Languages</th>
            <th role="columnheader" scope="col">Availability</th>
            <th role="columnheader" scope="col">Skills to certificate</th>
          </tr>
        </thead>
        {persons.map((person: any) => (
          <tbody role="rowgroup" key={person.name}>
            <tr role="row">
              <td role="cell" data-label="Name">{person.name}</td>
              <td role="cell" data-label="Type">{person.personType.name}</td>
              <td role="cell" data-label="Location">{person.location.name}</td>
              <td role="cell" data-label="Skills">{person.skills.map((skill: any) => badge(skill.name))}</td>
              <td role="cell" data-label="Languages">{person.languages.map((language: any) => badge(language.name))}</td>
              <td role="cell" data-label="Availability">{person.availability.map((availability: any) => badge(availability.name))}</td>
              <td role="cell" data-label="Skills to certificate">{person.skillsToCertificate.map((skill: any) => badge(skill.name))}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default App
