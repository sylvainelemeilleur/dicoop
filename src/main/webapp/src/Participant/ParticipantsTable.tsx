import { Badge } from "@patternfly/react-core";
import React from "react";

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
        <tbody key={person.name}>
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
              {person.skills.map((skill: any) => (
                <Badge key={skill.name} isRead>
                  {skill.name}
                </Badge>
              ))}
            </td>
            <td role="cell" data-label="Languages">
              {person.languages.map((language: any) => (
                <Badge key={language.name} isRead>
                  {language.name}
                </Badge>
              ))}
            </td>
            <td role="cell" data-label="Availability">
              {person.availability.map((availability: any) => (
                <Badge key={availability.name} isRead>
                  {availability.name}
                </Badge>
              ))}
            </td>
            <td role="cell" data-label="Skills to certificate">
              {person.skillsToCertificate.map((skill: any) => (
                <Badge key={skill.name} isRead>
                  {skill.name}
                </Badge>
              ))}
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

export default ParticipantsTable;
