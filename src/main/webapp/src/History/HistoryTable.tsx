import { CommitteeSet } from "src/Model/CommitteeSet";
import SolutionTable from "src/Solution/SolutionTable";

type HistoryTableProps = {
  history: Array<CommitteeSet>;
};

function HistoryTable({ history }: HistoryTableProps) {
  return (
    <>
      {history.map((committees) => (
        <div key={committees.id}>
          <span>Solution {committees.date}</span>
          <SolutionTable committees={committees} />
        </div>
      ))}
    </>
  );
}

export default HistoryTable;
