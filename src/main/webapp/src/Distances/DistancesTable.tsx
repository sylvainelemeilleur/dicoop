import { NumberInput, Table } from "@mantine/core";
import { DistanceMatrix } from "src/api";

type DistancesTableProps = {
  distances: DistanceMatrix;
  updateDistance: (i: number, j: number, value: number) => void;
};

function Distances({ distances, updateDistance }: DistancesTableProps) {
  return (
    <Table style={{ width: "auto" }}>
      <thead>
        <tr>
          <th />
          {distances.locations?.map((location) => (
            <th key={location}>{location}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {distances.distances?.map((distanceLocal, i) => (
          <tr key={i}>
            <td>
              <b>{distances.locations?.[i]}</b>
            </td>
            {distanceLocal.map((distance, j) => (
              <td key={j}>
                <NumberInput
                  value={distance}
                  required
                  hideControls={false}
                  size="xs"
                  style={{ width: "60px" }}
                  onChange={(value) => updateDistance(i, j, value ?? 0)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Distances;
