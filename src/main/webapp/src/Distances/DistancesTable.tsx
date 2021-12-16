import { Table } from "@mantine/core";
import { DistanceMatrix } from "src/api";

type DistancesTableProps = {
  distances: DistanceMatrix;
};

function Distances({ distances }: DistancesTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          {distances.locations?.map((location) => (
            <th key={location}>{location}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {distances.distances?.map((distanceLocal, index) => {
          return (
            <tr key={index}>
              <td>
                <b>{distances.locations?.[index]}</b>
              </td>
              {distanceLocal.map((distance, indexLocal) => (
                <td key={indexLocal}>{distance}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default Distances;
