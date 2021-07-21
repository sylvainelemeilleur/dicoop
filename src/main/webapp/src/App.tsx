import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
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

  return (
    <div className="App">
      <table className="pf-c-table pf-m-grid-md" role="grid" aria-label="Supersonic Subatomic Particles" id="table-basic">
        <caption>Participants</caption>
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col">Name</th>
            <th role="columnheader" scope="col">Type</th>
            <th role="columnheader" scope="col">Location</th>
          </tr>
        </thead>
        {persons.map((person: any) => (
          <tbody role="rowgroup">
            <tr role="row">
              <td role="cell" data-label="Person name">{person.name}</td>
              <td role="cell" data-label="Person type">{person.personType.name}</td>
              <td role="cell" data-label="Person type">{person.location.name}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default App
