import {
  Col,
  Container,
  Grid,
  InputWrapper,
  LoadingOverlay,
  NumberInput,
  RangeSlider,
  Slider,
  Space,
} from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <LoadingOverlay visible={isSolving} />
      <Grid>
        <Col span={6}>
          <Container>
            <InputWrapper
              id="nbProParticipants"
              label={t("settings.nbProParticipants")}
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
              label={t("settings.nbAssignmentsPerPro")}
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
              label={t("settings.nbNonProParticipants")}
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
              label={t("settings.nbAssignmentsPerNonPro")}
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
              label={t("settings.nbExternalParticipants")}
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
              label={t("settings.nbAssignmentsPerExternal")}
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
          </Container>
        </Col>
        <Col span={6}>
          <InputWrapper
            id="nbRotationsToReinspect"
            label={t("settings.nbRotations")}
          >
            <br />
            <NumberInput
              value={settingsState.nbRotationsToReinspect}
              required
              size="xs"
              style={{ width: "60px", display: "inline-block" }}
              onChange={(value) =>
                setSettingsState({ nbRotationsToReinspect: value })
              }
            />
          </InputWrapper>

          <Space h="lg" />

          <InputWrapper
            id="travellingDistanceRange"
            label={t("settings.travellingDistanceRange")}
          >
            <br />
            <NumberInput
              label="Min"
              value={settingsState.travellingDistanceRange[0]}
              required
              size="xs"
              style={{ width: "60px", display: "inline-block" }}
              onChange={(value) =>
                setSettingsState({
                  travellingDistanceRange: [
                    value ?? 0,
                    settingsState.travellingDistanceRange[1],
                  ],
                })
              }
            />
            <NumberInput
              label="Max"
              value={settingsState.travellingDistanceRange[1]}
              required
              size="xs"
              style={{
                width: "60px",
                display: "inline-block",
                marginLeft: "10px",
              }}
              onChange={(value) =>
                setSettingsState({
                  travellingDistanceRange: [
                    settingsState.travellingDistanceRange[0],
                    value ?? 0,
                  ],
                })
              }
            />
          </InputWrapper>

          <Space h="lg" />
        </Col>
      </Grid>
    </div>
  );
}

export default SolutionSettingsForm;
