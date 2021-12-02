import {
  Badge,
  Button,
  Group,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Space,
  Table,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import React, { useState } from "react";
import { Person } from "src/api";
import { NamedEntity } from "src/Model/NamedEntity";
import "./ParticipantsTable.css";

type ParticipantsTableProps = {
  participants: Array<Person>;
};

function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const badgeList = (namedList?: Array<NamedEntity>) => (
    <>
      {namedList?.map((item: any) => (
        <Badge key={item.name}>{item.name}</Badge>
      ))}
    </>
  );

  // Edition modal
  const [opened, setOpened] = useState(false);
  const participantForm = useForm({
    initialValues: { name: "", type: "professional", location: "" },
  });
  const [locations, setLocations] = useState<Array<string>>([]);
  const editParticipant = (participant: Person) => {
    // initialize the locations with the existing ones in participants
    setLocations(
      Array.from(
        new Set(
          participants
            .map((p) => p.location?.name ?? "")
            .filter((l) => l && l.length > 0)
        )
      ).sort()
    );
    participantForm.setFieldValue("name", participant?.name ?? "");
    participantForm.setFieldValue(
      "type",
      participant?.personType?.name ?? "professional"
    );
    participantForm.setFieldValue(
      "location",
      participant?.location?.name ?? ""
    );
    setOpened(true);
  };

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit">
        <form
          onSubmit={participantForm.onSubmit((values) => console.log(values))}
        >
          <TextInput
            data-autofocus
            required
            placeholder="Participant name"
            label="Name"
            value={participantForm.values.name}
            onChange={(event) =>
              participantForm.setFieldValue("name", event.currentTarget.value)
            }
          />
          <Space h="lg" />
          <RadioGroup
            label="Type"
            required
            value={participantForm.values.type}
            onChange={(value) => participantForm.setFieldValue("type", value)}
          >
            <Radio value="professional">professional</Radio>
            <Radio value="non-professional">non-professional</Radio>
            <Radio value="external">external</Radio>
          </RadioGroup>
          <Space h="lg" />
          <Select
            label="Location"
            placeholder="Pick one"
            data={locations}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => setLocations((current) => [...current, query])}
            value={participantForm.values.location}
            onChange={(value) =>
              participantForm.setFieldValue("location", value ?? "")
            }
          />
          <Space h="lg" />
          <Group>
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
      <Table highlightOnHover aria-label="Participants" id="table-basic">
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
          <tbody
            key={person.name}
            onClick={() => editParticipant(person)}
            className="cursorPointer"
          >
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
      </Table>
    </>
  );
}

export default ParticipantsTable;
