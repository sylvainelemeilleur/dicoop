import {
  AppShell,
  Button,
  Divider,
  Drawer,
  Group,
  Header,
  Navbar,
  Space,
  Tab,
  Tabs,
  Textarea,
  Title,
} from "@mantine/core";
import React, { useRef, useState } from "react";
import {
  CommitteeSolutionResourceApi,
  Configuration,
  Person,
  Range,
  Settings,
  SolverOptions,
} from "./api";
import "./App.css";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import { useErrorMessage } from "./ErrorMessage/ErrorMessageContext";
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
  // Error modal from the context
  const showErrorMessage = useErrorMessage().showErrorMessage;

  // Application state
  const [isSolving, setIsSolving] = useState(false);
  const [participants, setParticipants] = useState(NO_PARTICIPANTS);
  const [committeeSolution, setCommitteeSolution] =
    useState(UNDEFINED_SOLUTION);
  const [history, setHistory] = useState(NO_HISTORY);

  const updateParticipant = (key: string, participant: Person) => {
    if (key.length) {
      setParticipants(
        participants.map((p) => (p.name === key ? participant : p))
      );
    } else {
      setParticipants([...participants, participant]);
    }
  };

  const deleteParticipant = (key: string) => {
    if (key.length) {
      setParticipants(participants.filter((p) => p.name !== key));
    }
  };

  // Tabs state
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [solutionTabDisabled, setSolutionTabDisabled] = useState(true);

  // Settings state
  const [nbProParticipants, setNbProParticipants] = useState(2);
  const [nbNonProParticipants, setNbNonProParticipants] = useState(1);
  const [nbExternalParticipants, setNbExternalParticipants] = useState(0);
  const [numberOfAssignments, setNumberOfAssignments] = useState([1, 5] as [
    number,
    number
  ]);
  const [nbRotationsToReinspect, setNbRotationsToReinspect] = useState(0);

  const getSettings = () =>
    ({
      nbProParticipants,
      nbNonProParticipants,
      numberOfAssignments: {
        value: numberOfAssignments,
      } as Range,
      nbRotationsToReinspect,
    } as Settings);

  const setSettings = (settings: Settings) => {
    setNbProParticipants(settings?.nbProParticipants ?? 0);
    setNbNonProParticipants(settings?.nbNonProParticipants ?? 0);
    setNbExternalParticipants(settings?.nbExternalParticipants ?? 0);
    setNumberOfAssignments(
      (settings?.numberOfAssignments?.value as [number, number]) ?? [0, 0]
    );
    setNbRotationsToReinspect(settings?.nbRotationsToReinspect ?? 0);
  };

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
    showErrorMessage("Excel import error", result.getMessage());
  };

  const dataImport = (file: any) => {
    excelImport(file, onDataImport, onDataImportError);
  };

  const getParticipantsWithHistory = () => {
    const historyToTake = history.slice(0, nbRotationsToReinspect);
    participants.forEach((participant) => {
      const hasAlreadyInspected = [] as string[];
      historyToTake.forEach((set) => {
        set.getCommittees().forEach((committee) => {
          if (
            committee.assignments
              .map((a) => a.assignedPerson?.name)
              .includes(participant.name)
          ) {
            hasAlreadyInspected.push(committee.evaluatedPerson?.name ?? "");
          }
        });
      });
      participant.hasAlreadyInspected = hasAlreadyInspected;
    });
    return participants;
  };

  const startSolving = () => {
    setIsSolving(true);
    const options = {
      settings: getSettings(),
      participants: getParticipantsWithHistory(),
    } as SolverOptions;
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
        showErrorMessage("Error while starting the solver", error.message);
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
        showErrorMessage("Error while stopping the solver", error.message);
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
        showErrorMessage("Error while refreshing the solution", error.message);
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

  // Sore explanation
  const [showMore, setShowMore] = useState(false);
  const showScore = (score: any) => {
    const parsedScore = JSON.parse(committeeSolution.score);
    return (
      <ul>
        {Object.keys(parsedScore).map((i) => (
          <li>
            {i} = {parsedScore[i].toString()}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} padding="xs">
          {
            <>
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
                  <Group position="left" direction="row">
                    <Button onClick={openFileDialog}>Import</Button>
                    <Button onClick={dataExport}>Export</Button>
                    <Button onClick={startSolving}>Solve</Button>
                  </Group>
                )}
              </div>
              <Divider my="sm" />
              <div>
                <b>Status</b>: {committeeSolution.solverStatus}
                <br />
                {committeeSolution.id && (
                  <div>
                    <b>ID</b>: {committeeSolution.id}
                  </div>
                )}
                {committeeSolution.score && (
                  <div>
                    <b>Score:</b> {showScore(committeeSolution.score)}
                  </div>
                )}
                {committeeSolution.scoreExplanation && (
                  <>
                    <Drawer
                      opened={showMore}
                      onClose={() => setShowMore(false)}
                      title="Score explanation"
                      padding="xl"
                      size="xl"
                      position="right"
                    >
                      <Textarea
                        value={committeeSolution.scoreExplanation}
                        autosize
                      />
                    </Drawer>
                    <Space h="md" />
                    <Group position="left">
                      <Button onClick={() => setShowMore(true)}>
                        Open score explanation
                      </Button>
                    </Group>
                  </>
                )}
              </div>
            </>
          }
        </Navbar>
      }
      header={
        <Header height={50} padding="xs">
          {<Title order={3}>DICOOP</Title>}
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
            nbRotationsToReinspect={nbRotationsToReinspect}
            setNbRotationsToReinspect={setNbRotationsToReinspect}
            isSolving={isSolving}
            committeeSolution={committeeSolution}
          />
          <Space h="xl" />
          <Tabs active={activeTabKey} onTabChange={setActiveTabKey}>
            <Tab label="Participants">
              <ParticipantsTable
                participants={participants}
                updateParticipant={updateParticipant}
                deleteParticipant={deleteParticipant}
              />
            </Tab>
            <Tab label="History">
              <HistoryTable history={history}></HistoryTable>
            </Tab>
            <Tab label="Solution" disabled={solutionTabDisabled}>
              <SolutionTable committees={committeeSolution.committees} />
            </Tab>
          </Tabs>
          <ErrorMessage />
        </>
      }
    </AppShell>
  );
}

export default App;
