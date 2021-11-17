import {
  AppShell,
  Button,
  Group,
  Header,
  Modal,
  Navbar,
  Space,
  Tab,
  Tabs,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { ExclamationTriangleIcon } from "@modulz/radix-icons";
import React, { useRef, useState } from "react";
import {
  CommitteeSolutionResourceApi,
  Configuration,
  Range,
  Settings,
  SolverOptions,
} from "./api";
import "./App.css";
import HistoryTable from "./History/HistoryTable";
import {
  NO_HISTORY,
  NO_PARTICIPANTS,
  UNDEFINED_SOLUTION,
} from "./Model/Defaults";
import { PersistenceData } from "./Model/PersistenceData";
import { Solution } from "./Model/Solution";
import ParticipantsTable from "./Participant/ParticipantsTable";
import { excelExport, excelImport } from "./Persistence/Excel";
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
  // State
  const [participants, setParticipants] = useState(NO_PARTICIPANTS);
  const [committeeSolution, setCommitteeSolution] =
    useState(UNDEFINED_SOLUTION);
  const [history, setHistory] = useState(NO_HISTORY);

  // Settings state
  const [nbProParticipants, setNbProParticipants] = useState(2);
  const [nbNonProParticipants, setNbNonProParticipants] = useState(1);
  const [nbExternalParticipants, setNbExternalParticipants] = useState(0);
  const [numberOfAssignments, setNumberOfAssignments] = useState([1, 5] as [
    number,
    number
  ]);

  const getSettings = () =>
    ({
      nbProParticipants,
      nbNonProParticipants,
      numberOfAssignments: {
        value: numberOfAssignments,
      } as Range,
    } as Settings);

  const setSettings = (settings: Settings) => {
    setNbProParticipants(settings?.nbProParticipants ?? 0);
    setNbNonProParticipants(settings?.nbNonProParticipants ?? 0);
    setNbExternalParticipants(settings?.nbExternalParticipants ?? 0);
    setNumberOfAssignments(
      (settings?.numberOfAssignments?.value as [number, number]) ?? [0, 0]
    );
  };

  // Tabs state
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [solutionTabDisabled, setSolutionTabDisabled] = useState(true);

  // API configuration
  const apiConfig = new Configuration({
    basePath: window.location.origin,
  });
  const committeeSolutionResourceApi = new CommitteeSolutionResourceApi(
    apiConfig
  );

  // data import and export
  const dataExport = () => {
    excelExport(getSettings(), participants, history, committeeSolution);
  };

  const onDataImport = (data: PersistenceData) => {
    setCommitteeSolution(UNDEFINED_SOLUTION);
    setSettings(data.settings);
    setParticipants(data.participants);
    setHistory(data.history);
    setSolutionTabDisabled(true);
    setActiveTabKey(0);
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

  const startSolving = () => {
    setIsSolving(true);
    const options = { settings: getSettings(), participants } as SolverOptions;
    committeeSolutionResourceApi
      .apiCommitteeSolutionSolvePost(options)
      .then((resp) => {
        const solutionId = resp.data.id ?? "ID_ERROR";
        const initializedSolution = UNDEFINED_SOLUTION;
        initializedSolution.id = solutionId;
        initializedSolution.solverStatus = "INITIALIZING";
        setCommitteeSolution(initializedSolution);
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
    setSolutionTabDisabled(false);
    setActiveTabKey(2);
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

  // file picker
  const inputFile = useRef<HTMLInputElement>(null);
  const handleFileOpened = (e: any) => {
    const { files } = e.target;
    if (files?.length) {
      const file = files[0];
      dataImport(file);
      e.target.value = ""; // trick to allow the selection of the same file again
    }
  };
  const openFileDialog = () => {
    inputFile?.current?.click();
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} padding="xs">
          {
            <div>
              <input
                style={{ display: "none" }}
                accept=".xlsx"
                ref={inputFile}
                onChange={handleFileOpened}
                type="file"
              />
              {isSolving ? (
                <Button onClick={stopSolving}>Stop</Button>
              ) : (
                <Group position="left" direction="column">
                  <Button onClick={openFileDialog}>Import</Button>
                  <Button onClick={dataExport}>Export</Button>
                  <Button onClick={startSolving}>Solve</Button>
                </Group>
              )}
            </div>
          }
        </Navbar>
      }
      header={
        <Header height={50} padding="xs">
          {<Title order={3}>PGS PLANNER</Title>}
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {
        <>
          <SolutionSettingsForm
            nbProParticipants={nbProParticipants}
            setNbProParticipants={setNbProParticipants}
            nbNonProParticipants={nbNonProParticipants}
            setNbNonProParticipants={setNbNonProParticipants}
            nbExternalParticipants={nbExternalParticipants}
            setNbExternalParticipants={setNbExternalParticipants}
            numberOfAssignments={numberOfAssignments}
            setNumberOfAssignments={setNumberOfAssignments}
            isSolving={isSolving}
            committeeSolution={committeeSolution}
          />
          <Space h="xl" />
          {participants.length > 0 ? (
            <Tabs active={activeTabKey} onTabChange={setActiveTabKey}>
              <Tab label="Participants">
                <ParticipantsTable participants={participants} />
              </Tab>
              <Tab label="History">
                <HistoryTable history={history}></HistoryTable>
              </Tab>
              <Tab label="Solution" disabled={solutionTabDisabled}>
                <SolutionTable committees={committeeSolution.committees} />
              </Tab>
            </Tabs>
          ) : (
            <div>Please import a valid pgs-planner xlsx file.</div>
          )}
          <Modal
            opened={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            title={
              <>
                <ThemeIcon color="red">
                  <ExclamationTriangleIcon />
                </ThemeIcon>
                &nbsp;
                <b>{errorMessage.header}</b>
              </>
            }
          >
            {errorMessage.message}
          </Modal>
        </>
      }
    </AppShell>
  );
}

export default App;
