import {
  Col,
  Container,
  Grid,
  InputWrapper,
  LoadingOverlay,
  RangeSlider,
  Slider,
  Space,
} from "@mantine/core";
import React from "react";
import { SettingsState } from "src/Model/SettingsState";
import { Solution } from "src/Model/Solution";

type SolutionSettingsProps = {
  settingsState: SettingsState;
  setSettingsState: (
    statePartial:
      | Partial<SettingsState>
      | ((currentState: SettingsState) => Partial<SettingsState>)
  ) => void;
  committeeSolution: Solution;
  isSolving: boolean;
};

function SolutionSettingsForm({
  settingsState,
  setSettingsState,
  committeeSolution,
  isSolving,
}: SolutionSettingsProps) {
  const min = 0;
  const max = 5;
  const marks = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <LoadingOverlay visible={isSolving} />
      <Grid>
        <Col span={6}>
          <Container>
            <InputWrapper
              id="nbProParticipants"
              label="Number of professionals participants"
            >
              <Slider
                id="nbProParticipants"
                value={settingsState.nbProParticipants}
                min={min}
                max={max}
                marks={marks}
                onChange={(value) =>
                  setSettingsState({ nbProParticipants: value })
                }
              />
            </InputWrapper>

            <Space h="lg" />

            <InputWrapper
              id="numberOfAssignmentsPro"
              label="Number of assignments per professional participant"
            >
              <RangeSlider
                id="numberOfAssignmentsPro"
                value={settingsState.numberOfAssignmentsForAProfessional}
                step={1}
                min={min}
                max={max}
                minRange={0}
                marks={marks}
                onChange={(values) =>
                  setSettingsState({
                    numberOfAssignmentsForAProfessional: values,
                  })
                }
              />
            </InputWrapper>

            <Space h="lg" />

            <InputWrapper
              id="nbNonProParticipants"
              label="Number of non-professionals participants"
            >
              <Slider
                id="nbNonProParticipants"
                value={settingsState.nbNonProParticipants}
                min={min}
                max={max}
                marks={marks}
                onChange={(value) =>
                  setSettingsState({ nbNonProParticipants: value })
                }
              />
            </InputWrapper>

            <Space h="lg" />

            <InputWrapper
              id="numberOfAssignmentsNonPro"
              label="Number of assignments per non professional participant"
            >
              <RangeSlider
                id="numberOfAssignmentsNonPro"
                value={settingsState.numberOfAssignmentsForANonProfessional}
                step={1}
                min={min}
                max={max}
                minRange={0}
                marks={marks}
                onChange={(values) =>
                  setSettingsState({
                    numberOfAssignmentsForANonProfessional: values,
                  })
                }
              />
            </InputWrapper>

            <Space h="lg" />

            <InputWrapper
              id="nbExternalParticipants"
              label="Number of external participants"
            >
              <Slider
                id="nbExternalParticipants"
                value={settingsState.nbExternalParticipants}
                min={min}
                max={max}
                marks={marks}
                onChange={(value) =>
                  setSettingsState({ nbExternalParticipants: value })
                }
              />
            </InputWrapper>

            <Space h="lg" />

            <InputWrapper
              id="numberOfAssignmentsExternal"
              label="Number of assignments per external participant"
            >
              <RangeSlider
                id="numberOfAssignmentsExternal"
                value={settingsState.numberOfAssignmentsForAnExternal}
                step={1}
                min={min}
                max={max}
                minRange={0}
                marks={marks}
                onChange={(values) =>
                  setSettingsState({
                    numberOfAssignmentsForAnExternal: values,
                  })
                }
              />
            </InputWrapper>

            <Space h="lg" />

            <InputWrapper
              id="nbRotationsToReinspect"
              label="Number of rotations to re-inspect a participant"
            >
              <Slider
                id="nbRotationsToReinspect"
                value={settingsState.nbRotationsToReinspect}
                min={min}
                max={max}
                marks={marks}
                onChange={(value) =>
                  setSettingsState({ nbRotationsToReinspect: value })
                }
              />
            </InputWrapper>
            <Space h="lg" />
          </Container>
        </Col>
        <Col span={6} />
      </Grid>
    </div>
  );
}

export default SolutionSettingsForm;
