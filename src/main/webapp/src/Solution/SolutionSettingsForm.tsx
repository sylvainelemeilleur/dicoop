import {
  ActionGroup,
  CodeBlock,
  CodeBlockCode,
  ExpandableSection,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Popover,
  Slider,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import React, { useRef, useState } from "react";
import { SolverOptions } from "src/api";
import { Solution } from "src/Model/Solution";

type SolutionSettingsProps = {
  committeeSolution: Solution;
  isSolving: boolean;
  startSolving: (options: SolverOptions) => void;
  stopSolving: () => void;
  dataImport: (file: any) => void;
  dataExport: () => void;
};

function SolutionSettingsForm({
  committeeSolution,
  isSolving,
  startSolving,
  stopSolving,
  dataImport,
  dataExport,
}: SolutionSettingsProps) {
  const [nbProParticipants, setNbProParticipants] = useState(2);
  const [nbNonProParticipants, setNbNonProParticipants] = useState(1);
  const [maximumNumberOfAssignments, setMaximumNumberOfAssignments] =
    useState(5);
  const min = 0;
  const max = 5;
  const [showMore, setShowMore] = useState(false);

  // file picker
  const inputFile = useRef<HTMLInputElement>(null);
  const handleFileOpened = (e: any) => {
    const { files } = e.target;
    if (files && files.length) {
      const file = files[0];
      dataImport(file);
    }
  };
  const openFileDialog = () => {
    inputFile?.current?.click();
  };

  const solve = () => {
    const options = {
      nbProParticipants,
      nbNonProParticipants,
      maximumNumberOfAssignments,
    } as SolverOptions;
    startSolving(options);
  };

  const sliderDivStyle = {
    width: "90%",
  };

  const makePopover = (headerContent: string, bodyContent: string) => {
    return (
      <Popover
        headerContent={<div>{headerContent}</div>}
        bodyContent={<div>{bodyContent}</div>}
      >
        <button
          type="button"
          aria-label="More info for name field"
          onClick={(e) => e.preventDefault()}
          aria-describedby="simple-form-name-02"
          className="pf-c-form__group-label-help"
        >
          <HelpIcon noVerticalAlign />
        </button>
      </Popover>
    );
  };
  return (
    <Grid cellPadding={30}>
      <GridItem sm={6}>
        <Form isHorizontal>
          <FormGroup
            label="Number of professionals"
            fieldId="nbProParticipants"
            labelIcon={makePopover(
              `The number of professionals participants`,
              `Between ${min} and ${max}`
            )}
            isInline
          >
            <div style={sliderDivStyle}>
              <Slider
                id="nbProParticipants"
                value={nbProParticipants}
                inputValue={nbProParticipants}
                onChange={setNbProParticipants}
                min={0}
                max={5}
                step={1}
                showTicks
                isInputVisible
              />
            </div>
          </FormGroup>
          <FormGroup
            label="Number of non-professionals"
            fieldId="nbNonProParticipants"
            labelIcon={makePopover(
              `The number of non-professionals participants`,
              `Between ${min} and ${max}`
            )}
            isInline
          >
            <div style={sliderDivStyle}>
              <Slider
                id="nbNonProParticipants"
                value={nbNonProParticipants}
                inputValue={nbNonProParticipants}
                onChange={setNbNonProParticipants}
                min={0}
                max={5}
                step={1}
                showTicks
                isInputVisible
              />
            </div>
          </FormGroup>
          <FormGroup
            label="Maximum number of assignments per participant"
            fieldId="maximumNumberOfAssignments"
            labelIcon={makePopover(
              `Maximum number of assignments per participant`,
              `Between ${min} and ${max}`
            )}
            isInline
          >
            <div style={sliderDivStyle}>
              <Slider
                id="maximumNumberOfAssignments"
                value={maximumNumberOfAssignments}
                inputValue={maximumNumberOfAssignments}
                onChange={setMaximumNumberOfAssignments}
                min={0}
                max={5}
                step={1}
                showTicks
                isInputVisible
              />
            </div>
          </FormGroup>
          <ActionGroup>
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
              <>
                <button
                  className="pf-c-button pf-m-primary"
                  type="button"
                  onClick={solve}
                >
                  Solve
                </button>
                <input
                  style={{ display: "none" }}
                  accept=".xlsx"
                  ref={inputFile}
                  onChange={handleFileOpened}
                  type="file"
                />
                <button
                  className="pf-c-button pf-m-primary"
                  type="button"
                  onClick={openFileDialog}
                >
                  Import
                </button>
                <button
                  className="pf-c-button pf-m-primary"
                  type="button"
                  onClick={dataExport}
                >
                  Export
                </button>
              </>
            )}
          </ActionGroup>
        </Form>
      </GridItem>
      <GridItem sm={6}>
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
          <ExpandableSection
            toggleText={showMore ? "Show less" : "Show more"}
            onToggle={setShowMore}
            isExpanded={showMore}
          >
            <CodeBlock>
              <CodeBlockCode id="code-content">
                {committeeSolution.scoreExplanation}
              </CodeBlockCode>
            </CodeBlock>
          </ExpandableSection>
        )}
      </GridItem>
    </Grid>
  );
}

export default SolutionSettingsForm;
