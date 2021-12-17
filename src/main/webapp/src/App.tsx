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
import { useSetState } from "@mantine/hooks";
import React, { useRef, useState } from "react";
import {
  CommitteeSolutionResourceApi,
  Configuration,
  DistanceMatrix,
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
import { SettingsState } from "./Model/SettingsState";
import { Solution } from "./Model/Solution";
import ParticipantsTable from "./Participant/ParticipantsTable";
import { excelExport, excelImport } from "./Persistence/Excel";
import { ValidationResult } from "./Persistence/ExcelValidation";
import SolutionSettingsForm from "./Solution/SolutionSettingsForm";
import SolutionTable from "./Solution/SolutionTable";
import DistancesTable from "./Distances/DistancesTable";
import { stringNotEmpty } from "./Model/ModelUtils";

function App() {
  // Error modal from the context
  const showErrorMessage = useErrorMessage().showErrorMessage;

  // Application state
  const [isSolving, setIsSolving] = useState(false);
  const [participants, setParticipants] = useState(NO_PARTICIPANTS);
  const [committeeSolution, setCommitteeSolution] =
    useState(UNDEFINED_SOLUTION);
  const [history, setHistory] = useState(NO_HISTORY);
  const [distances, setDistances] = useState({
    locations: new Array<string>(),
    distances: new Array<Array<number>>(),
  } as DistanceMatrix);

  const updateDistance = (i: number, j: number, value: number) => {
    if (distances.distances) distances.distances[i][j] = value;
    setDistances({
      locations: distances.locations,
      distances: distances.distances,
    });
  };

  const updateParticipant = (key: string, participant: Person) => {
    if (key.length) {
      setParticipants(
        participants.map((p) => (p.name === key ? participant : p))
      );
    } else {
      setParticipants([...participants, participant]);
    }
    // Checking if we have a new location to handle in the distance matrix
    const locationName = participant.location?.name ?? "";
    if (
      stringNotEmpty(locationName) &&
      distances.locations?.indexOf(locationName) === -1
    ) {
      distances.distances?.forEach((distanceLocal) => {
        distanceLocal.push(0);
      });
      distances.distances?.push(
        new Array(distances.locations.length + 1).fill(0)
      );
      setDistances({
        locations: [...distances.locations, locationName],
        distances: distances.distances,
      });
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
  const [settingsState, setSettingsState] = useSetState({
    nbProParticipants: 2,
    numberOfAssignmentsForAProfessional: [0, 5],
    nbNonProParticipants: 1,
    numberOfAssignmentsForANonProfessional: [0, 5],
    nbExternalParticipants: 0,
    numberOfAssignmentsForAnExternal: [0, 5],
    nbRotationsToReinspect: 0,
  } as SettingsState);

  const getSettings = () =>
    ({
      nbProParticipants: settingsState.nbProParticipants,
      numberOfAssignmentsForAProfessional: {
        value: settingsState.numberOfAssignmentsForAProfessional,
      } as Range,
      nbNonProParticipants: settingsState.nbNonProParticipants,
      numberOfAssignmentsForANonProfessional: {
        value: settingsState.numberOfAssignmentsForANonProfessional,
      } as Range,
      nbExternalParticipants: settingsState.nbExternalParticipants,
      numberOfAssignmentsForAnExternal: {
        value: settingsState.numberOfAssignmentsForAnExternal,
      } as Range,
      nbRotationsToReinspect: settingsState.nbRotationsToReinspect,
    } as Settings);

  const setSettings = (settings: Settings) => {
    setSettingsState({
      nbProParticipants: settings?.nbProParticipants ?? 0,
      numberOfAssignmentsForAProfessional: (settings
        ?.numberOfAssignmentsForAProfessional?.value as [number, number]) ?? [
        0, 0,
      ],
      nbNonProParticipants: settings?.nbNonProParticipants ?? 0,
      numberOfAssignmentsForANonProfessional: (settings
        ?.numberOfAssignmentsForANonProfessional?.value as [
        number,
        number
      ]) ?? [0, 0],
      nbExternalParticipants: settings?.nbExternalParticipants ?? 0,
      numberOfAssignmentsForAnExternal: (settings
        ?.numberOfAssignmentsForAnExternal?.value as [number, number]) ?? [
        0, 0,
      ],
      nbRotationsToReinspect: settings?.nbRotationsToReinspect ?? 0,
    });
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
    excelExport(
      getSettings(),
      participants,
      history,
      distances,
      committeeSolution
    );
  };

  const onDataImport = (data: PersistenceData) => {
    setCommitteeSolution(UNDEFINED_SOLUTION);
    setSettings(data.settings);
    setParticipants(data.participants);
    setHistory(data.history);
    setDistances(data.distances);
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
    const historyToTake = history.slice(
      0,
      settingsState.nbRotationsToReinspect
    );
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
    setActiveTabKey(3);
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
            settingsState={settingsState}
            setSettingsState={setSettingsState}
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
                distances={distances}
              />
            </Tab>
            <Tab label="Distances">
              <DistancesTable
                distances={distances}
                updateDistance={updateDistance}
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
