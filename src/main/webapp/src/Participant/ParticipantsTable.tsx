import React from "react";
import Badge from "../Visual/Badge";

function ParticipantsTable(props: any) {
  return (
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
      {props.persons.map((person: any) => (
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
              {person.skills.map((skill: any) => Badge(skill.name))}
            </td>
            <td role="cell" data-label="Languages">
              {person.languages.map((language: any) => Badge(language.name))}
            </td>
            <td role="cell" data-label="Availability">
              {person.availability.map((availability: any) =>
                Badge(availability.name)
              )}
            </td>
            <td role="cell" data-label="Skills to certificate">
              {person.skillsToCertificate.map((skill: any) =>
                Badge(skill.name)
              )}
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

export default ParticipantsTable;
