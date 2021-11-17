import {
  Button,
  Col,
  Container,
  Drawer,
  Grid,
  Group,
  InputWrapper,
  LoadingOverlay,
  RangeSlider,
  Slider,
  Space,
  Textarea,
} from "@mantine/core";
import React, { useState } from "react";
import { Solution } from "src/Model/Solution";

type SolutionSettingsProps = {
  nbProParticipants: number;
  setNbProParticipants: (value: number) => void;
  nbNonProParticipants: number;
  setNbNonProParticipants: (value: number) => void;
  nbExternalParticipants: number;
  setNbExternalParticipants: (value: number) => void;
  numberOfAssignments: [number, number];
  setNumberOfAssignments: (value: [number, number]) => void;
  nbRotationsToReinspect: number;
  setNbRotationsToReinspect: (value: number) => void;
  committeeSolution: Solution;
  isSolving: boolean;
};

function SolutionSettingsForm({
  nbProParticipants,
  setNbProParticipants,
  nbNonProParticipants,
  setNbNonProParticipants,
  nbExternalParticipants,
  setNbExternalParticipants,
  numberOfAssignments,
  setNumberOfAssignments,
  nbRotationsToReinspect,
  setNbRotationsToReinspect,
  committeeSolution,
  isSolving,
}: SolutionSettingsProps) {
  const min = 0;
  const max = 5;
  const [showMore, setShowMore] = useState(false);

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
                value={nbProParticipants}
                min={min}
                max={max}
                marks={marks}
                onChange={setNbProParticipants}
              ></Slider>
            </InputWrapper>
            <Space h="lg" />
            <InputWrapper
              id="nbNonProParticipants"
              label="Number of non-professionals participants"
            >
              <Slider
                id="nbNonProParticipants"
                value={nbNonProParticipants}
                min={min}
                max={max}
                marks={marks}
                onChange={setNbNonProParticipants}
              ></Slider>
            </InputWrapper>
            <Space h="lg" />
            <InputWrapper
              id="nbExternalParticipants"
              label="Number of external participants"
            >
              <Slider
                id="nbExternalParticipants"
                value={nbExternalParticipants}
                min={min}
                max={max}
                marks={marks}
                onChange={setNbExternalParticipants}
              ></Slider>
            </InputWrapper>
            <Space h="lg" />
            <InputWrapper
              id="numberOfAssignments"
              label="Number of assignments per participant"
            >
              <RangeSlider
                id="numberOfAssignments"
                value={numberOfAssignments}
                step={1}
                min={min}
                max={max}
                minRange={0}
                marks={marks}
                onChange={setNumberOfAssignments}
              ></RangeSlider>
            </InputWrapper>
            <Space h="lg" />
            <InputWrapper
              id="nbRotationsToReinspect"
              label="Number of rotations to re-inspect a participant"
            >
              <Slider
                id="nbRotationsToReinspect"
                value={nbRotationsToReinspect}
                min={min}
                max={max}
                marks={marks}
                onChange={setNbRotationsToReinspect}
              ></Slider>
            </InputWrapper>
            <Space h="lg" />
          </Container>
        </Col>
        <Col span={6}>
          <b>Status</b>: {committeeSolution.solverStatus}
          <br />
          {committeeSolution.id && (
            <div>
              <b>ID</b>: {committeeSolution.id}
            </div>
          )}
          {committeeSolution.score && (
            <div>
              <b>Score:</b> {committeeSolution.score}
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
                <Textarea value={committeeSolution.scoreExplanation} autosize />
              </Drawer>
              <Space h="md" />
              <Group position="left">
                <Button onClick={() => setShowMore(true)}>
                  Open score explanation
                </Button>
              </Group>
            </>
          )}
        </Col>
      </Grid>
    </div>
  );
}

export default SolutionSettingsForm;
