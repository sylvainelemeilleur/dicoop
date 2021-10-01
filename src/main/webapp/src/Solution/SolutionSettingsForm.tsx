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
import React, { useState } from "react";

function SolutionSettingsForm(props: any) {
  const [nbProParticipants, setNbProParticipants] = useState(2);
  const [nbNonProParticipants, setNbNonProParticipants] = useState(1);
  const min = 0;
  const max = 5;
  const [showMore, setShowMore] = useState(false);

  const solve = () => {
    const options = {
      nbProParticipants,
      nbNonProParticipants,
    };
    props.startSolving(options);
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
          <ActionGroup>
            {props.isSolving ? (
              <button
                className="pf-c-button pf-m-secondary"
                type="button"
                onClick={props.stopSolving}
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
                <button
                  className="pf-c-button pf-m-primary"
                  type="button"
                  onClick={props.dataExport}
                >
                  Export
                </button>
              </>
            )}
          </ActionGroup>
        </Form>
      </GridItem>
      <GridItem sm={6}>
        <b>Status</b>: {props.committeeSolution.solverStatus}
        <br />
        {props.committeeSolution.id && (
          <div>
            <b>ID</b>: {props.committeeSolution.id}
          </div>
        )}
        {props.committeeSolution.score && (
          <div>
            <b>Score:</b> {props.committeeSolution.score}
          </div>
        )}
        {props.committeeSolution.scoreExplanation && (
          <ExpandableSection
            toggleText={showMore ? "Show less" : "Show more"}
            onToggle={setShowMore}
            isExpanded={showMore}
          >
            <CodeBlock>
              <CodeBlockCode id="code-content">
                {props.committeeSolution.scoreExplanation}
              </CodeBlockCode>
            </CodeBlock>
          </ExpandableSection>
        )}
      </GridItem>
    </Grid>
  );
}

export default SolutionSettingsForm;
