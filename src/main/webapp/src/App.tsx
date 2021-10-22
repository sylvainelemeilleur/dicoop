import React, { useEffect, useState } from "react";
import "./App.css";
import SolutionSettingsForm from "./Solution/SolutionSettingsForm";
import SolutionTable from "./Solution/SolutionTable";
import ParticipantsTable from "./Participant/ParticipantsTable";
import { Flex, FlexItem } from "@patternfly/react-core";
import { excelExport } from "./Persistence/Excel";
import {
  CommitteeSolution,
  CommitteeSolutionResourceApi,
  Configuration,
  Person,
  PersonResourceApi,
  SolverOptions,
} from "./api";
import { Solution } from "./Model/Solution";

function App() {
  const [isSolving, setIsSolving] = useState(false);
  const [persons, setPersons] = useState(new Array<Person>());
  const [settings, setSettings] = useState({
    nbProParticipants: 2,
    nbNonProParticipants: 1,
    maximumNumberOfAssignments: 5,
  } as SolverOptions);
  const [committeeSolution, setCommitteeSolution] = useState(
    new Solution("UNDEFINED", [], {}, "NOT_STARTED", "", "")
  );

  // API configuration
  const apiConfig = new Configuration({
    basePath: window.location.origin,
  });
  const committeeSolutionResourceApi = new CommitteeSolutionResourceApi(
    apiConfig
  );
  const fetchPersons = () => {
    const personResourceApi = new PersonResourceApi(apiConfig);
    personResourceApi
      .apiPersonsGet()
      .then((resp) => setPersons(resp.data))
      .catch(console.log);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchPersons, []);

  const parseSolution = (solution: CommitteeSolution): Solution => {
    const committees = solution.committeeAssignments?.reduce(
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
    return new Solution(
      solution.id ?? "ID_UNDEFINED",
      committees,
      solution.committeeAssignments,
      solution.solverStatus ?? "STATUS_UNDEFINED",
      JSON.stringify(solution.score),
      solution.scoreExplanation ?? "SCORE_EXPLANATION_UNDEFINED"
    );
  };

  const dataExport = () => {
    excelExport(settings, persons, committeeSolution);
  };

  const startSolving = (solverOptions: SolverOptions) => {
    setSettings(solverOptions);
    setIsSolving(true);
    committeeSolutionResourceApi
      .apiCommitteeSolutionSolvePost(solverOptions)
      .then((resp) => {
        const solutionId = resp.data.id ?? "ID_ERROR";
        setCommitteeSolution({
          id: solutionId,
          committeeAssignments: [],
          committees: {},
          solverStatus: "INITIALIZING",
          score: "",
          scoreExplanation: "",
        });
        setTimeout(() => {
          refreshSolution(solutionId);
        }, 2000);
      })
      .catch(console.log);
  };

  const stopSolving = () => {
    committeeSolutionResourceApi
      .apiCommitteeSolutionStopSolvingIdGet(committeeSolution.id)
      .then(() => {
        setIsSolving(false);
      });
  };

  const refreshSolution = (id: string) => {
    committeeSolutionResourceApi
      .apiCommitteeSolutionIdGet(id)
      .then((res) => {
        setCommitteeSolution(parseSolution(res.data));
        if (res.data.solverStatus === "SOLVING_ACTIVE") {
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
    <Flex direction={{ default: "column" }}>
      <FlexItem cellPadding={30}>
        <SolutionSettingsForm
          isSolving={isSolving}
          startSolving={startSolving}
          stopSolving={stopSolving}
          dataExport={dataExport}
          committeeSolution={committeeSolution}
        />
      </FlexItem>
      {committeeSolution.id && (
        <FlexItem cellPadding={30}>
          <SolutionTable committeeSolution={committeeSolution} />
        </FlexItem>
      )}
      <FlexItem cellPadding={30}>
        <ParticipantsTable persons={persons} />
      </FlexItem>
    </Flex>
  );
}

export default App;
