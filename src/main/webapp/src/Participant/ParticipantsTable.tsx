import { Badge } from "@patternfly/react-core";
import React from "react";
import { Person } from "src/api";
import { NamedEntity } from "src/Model/NamedEntity";

type ParticipantsTableProps = {
  participants: Array<Person>;
};

function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const badgeList = (namedList?: Array<NamedEntity>) => {
    return (
      <React.Fragment>
        {namedList?.map((item: any) => (
          <Badge key={item.name} isRead>
            {item.name}
          </Badge>
        ))}
      </React.Fragment>
    );
  };
  return (
    <table
      className="pf-c-table pf-m-compact pf-m-grid-md"
      role="grid"
      aria-label="Participants"
      id="table-basic"
    >
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
      {participants.map((person) => (
        <tbody key={person.name}>
          <tr role="row">
            <td role="cell" data-label="Name">
              {person.name}
            </td>
            <td role="cell" data-label="Type">
              {person.personType?.name}
            </td>
            <td role="cell" data-label="Location">
              {person.location?.name}
            </td>
            <td role="cell" data-label="Skills">
              {badgeList(person.skills as Array<NamedEntity>)}
            </td>
            <td role="cell" data-label="Languages">
              {badgeList(person.languages as Array<NamedEntity>)}
            </td>
            <td role="cell" data-label="Availability">
              {badgeList(person.availability as Array<NamedEntity>)}
            </td>
            <td role="cell" data-label="Skills to certificate">
              {badgeList(person.skillsToCertificate as Array<NamedEntity>)}
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

export default ParticipantsTable;
