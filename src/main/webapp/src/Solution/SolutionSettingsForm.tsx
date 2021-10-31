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
import { Settings } from "src/api";
import { copySettings } from "src/Model/ModelUtils";
import { Solution } from "src/Model/Solution";

type SolutionSettingsProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  committeeSolution: Solution;
  isSolving: boolean;
  startSolving: () => void;
  stopSolving: () => void;
  dataImport: (file: any) => void;
  dataExport: () => void;
};

function SolutionSettingsForm({
  settings,
  setSettings,
  committeeSolution,
  isSolving,
  startSolving,
  stopSolving,
  dataImport,
  dataExport,
}: SolutionSettingsProps) {
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
                value={settings.nbProParticipants}
                inputValue={settings.nbProParticipants}
                onChange={(value) => {
                  const newSettings = copySettings(settings);
                  newSettings.nbProParticipants = value;
                  setSettings(newSettings);
                }}
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
                value={settings.nbNonProParticipants}
                inputValue={settings.nbNonProParticipants}
                onChange={(value) => {
                  const newSettings = copySettings(settings);
                  newSettings.nbNonProParticipants = value;
                  setSettings(newSettings);
                }}
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
                value={settings.maximumNumberOfAssignments}
                inputValue={settings.maximumNumberOfAssignments}
                onChange={(value) => {
                  const newSettings = copySettings(settings);
                  newSettings.maximumNumberOfAssignments = value;
                  setSettings(newSettings);
                }}
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
                  onClick={startSolving}
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
