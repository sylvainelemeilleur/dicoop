import React, { useEffect, useState } from "react";
import "./App.css";
import SolutionSettingsForm from "./Solution/SolutionSettingsForm";
import SolutionTable from "./Solution/SolutionTable";
import ParticipantsTable from "./Participant/ParticipantsTable";
import NumberInput from "./Visual/NumberInput";

function App() {
  const [isSolving, setIsSolving] = useState(false);
  const [persons, setPersons] = useState([]);
  const [committeeSolution, setCommitteeSolution] = useState({
    id: null,
    committeeAssignments: [],
    committees: {},
    solverStatus: "NOT_STARTED",
    score: "",
    scoreExplanation: "",
  });

  useEffect(() => {
    fetch("/api/persons")
      .then((res) => res.json())
      .then((res) => {
        setPersons(res);
      })
      .catch(console.log);
  }, []);

  const parseSolution = (solution: any) => {
    const committees = solution.committeeAssignments.reduce(
      (r: any, a: any) => {
        r[a.committee.id] = r[a.committee.id] || {
          id: a.committee.id,
          evaluatedPerson: a.committee.evaluatedPerson,
          assignments: [],
        };
        r[a.committee.id].assignments.push(a);
        return r;
      },
      Object.create(null)
    );
    return {
      id: solution.id,
      committees,
      committeeAssignments: solution.committeeAssignments,
      solverStatus: solution.solverStatus,
      score: JSON.stringify(solution.score),
      scoreExplanation: solution.scoreExplanation,
    };
  };

  const startSolving = () => {
    fetch("/api/committeeSolution/solve")
      .then((res) => res.json())
      .then((res) => {
        setIsSolving(true);
        setCommitteeSolution({
          id: res.id,
          committeeAssignments: [],
          committees: {},
          solverStatus: "INITIALIZING",
          score: "",
          scoreExplanation: "",
        });
        setTimeout(() => {
          refreshSolution(res.id);
        }, 2000);
      })
      .catch(console.log);
  };

  const stopSolving = () => {
    fetch(`/api/committeeSolution/stopSolving/${committeeSolution.id}`).then(
      () => {
        setIsSolving(false);
      }
    );
  };

  const refreshSolution = (id: string) => {
    fetch(`/api/committeeSolution/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setCommitteeSolution(parseSolution(res));
        if (res.solverStatus === "SOLVING_ACTIVE") {
          setTimeout(() => {
            refreshSolution(id);
          }, 2000);
        } else {
          setIsSolving(false);
        }
      })
      .catch(console.log);
  };

  return (
    <div className="App">
      <SolutionSettingsForm />
      <NumberInput value={2} />
      {isSolving ? (
        <button
          className="pf-c-button pf-m-secondary"
          type="button"
          onClick={stopSolving}
        >
          Stop &nbsp;
          <span
            className="pf-c-spinner pf-m-sm"
            role="progressbar"
            aria-valuetext="Loading..."
          >
            <span className="pf-c-spinner__clipper"></span>
            <span className="pf-c-spinner__lead-ball"></span>
            <span className="pf-c-spinner__tail-ball"></span>
          </span>
        </button>
      ) : (
        <button
          className="pf-c-button pf-m-primary"
          type="button"
          onClick={startSolving}
        >
          Solve
        </button>
      )}
      <SolutionTable committeeSolution={committeeSolution} />
      <ParticipantsTable persons={persons} />
    </div>
  );
}

export default App;
