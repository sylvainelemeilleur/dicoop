import { Flex, FlexItem, Modal, ModalVariant } from "@patternfly/react-core";
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
import { excelImport, excelExport } from "./Persistence/Excel";
import { ValidationResult } from "./Persistence/ExcelValidation";
import SolutionSettingsForm from "./Solution/SolutionSettingsForm";
import SolutionTable from "./Solution/SolutionTable";

function App() {
  const [isSolving, setIsSolving] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    header: "",
    message: "",
  });
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

  // data import and export
  const dataExport = () => {
    excelExport(settings, persons, committeeSolution);
  };

  const onDataImport = (data: any) => {
    console.log(data);
  };

  const onDataImportError = (result: ValidationResult) => {
    setErrorMessage({
      header: "Excel import error",
      message: result.getMessage(),
    });
    setIsErrorModalOpen(true);
  };

  const dataImport = (file: any) => {
    excelImport(file, onDataImport, onDataImportError);
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
      .catch((error) => {
        setIsSolving(false);
        console.log(error);
        setErrorMessage({
          header: "Error while starting the solver",
          message: error.message,
        });
        setIsErrorModalOpen(true);
      });
  };

  const stopSolving = () => {
    committeeSolutionResourceApi
      .apiCommitteeSolutionStopSolvingIdGet(committeeSolution.id)
      .then(() => {
        setIsSolving(false);
      })
      .catch((error) => {
        setIsSolving(false);
        console.log(error);
        setErrorMessage({
          header: "Error while stopping the solver",
          message: error.message,
        });
        setIsErrorModalOpen(true);
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
      .catch((error) => {
        setIsSolving(false);
        console.log(error);
        setErrorMessage({
          header: "Error while refreshing the solution",
          message: error.message,
        });
        setIsErrorModalOpen(true);
      });
  };

  const handleErrorModalToggle = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  return (
    <React.Fragment>
      <Flex direction={{ default: "column" }}>
        <FlexItem cellPadding={30}>
          <SolutionSettingsForm
            isSolving={isSolving}
            startSolving={startSolving}
            stopSolving={stopSolving}
            dataImport={dataImport}
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
      <Modal
        variant={ModalVariant.small}
        isOpen={isErrorModalOpen}
        aria-label="Modal warning example"
        title={errorMessage.header}
        titleIconVariant="danger"
        showClose={true}
        onClose={handleErrorModalToggle}
      >
        {errorMessage.message}
      </Modal>
    </React.Fragment>
  );
}

export default App;
