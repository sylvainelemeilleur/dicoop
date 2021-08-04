import React, { useEffect, useState } from 'react'
import './App.css'
import '@patternfly/patternfly/patternfly.css';

function App() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    fetch('/api/persons')
      .then(res => res.json())
      .then((res) => { setPersons(res) })
      .catch(console.log);
  }, [])

  const badge = (item: any) => <span key={item} className="pf-c-badge pf-m-read">{item}</span>

  return (
    <div className="App">
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
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default App
