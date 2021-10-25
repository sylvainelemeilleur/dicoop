import { Flex, FlexItem } from "@patternfly/react-core";
import React, { useEffect, useState } from "react";
import {
  CommitteeSolutionResourceApi,
  Configuration,
  Person,
  PersonResourceApi,
  SolverOptions,
} from "./api";
import "./App.css";
import { Solution } from "./Model/Solution";
import ParticipantsTable from "./Participant/ParticipantsTable";
import { excelExport } from "./Persistence/Excel";
import SolutionSettingsForm from "./Solution/SolutionSettingsForm";
import SolutionTable from "./Solution/SolutionTable";

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
        setCommitteeSolution(Solution.fromCommitteeSolution(res.data));
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
