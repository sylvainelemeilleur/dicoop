import React, { useState } from "react";
import {
  ActionGroup,
  Form,
  FormGroup,
  Grid,
  GridItem,
  NumberInput,
  Popover,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";

function SolutionSettingsForm(props: any) {
  const [nbProParticipants, setNbProParticipants] = useState(2);
  const [nbNonProParticipants, setNbNonProParticipants] = useState(1);
  const min = 0;
  const max = 5;
  const setControlledValue = (val: number, valueSetter: any) => {
    valueSetter(val);
  };
  const onMinus = (val: number, valueSetter: any) => {
    return () => setControlledValue(val - 1, valueSetter);
  };
  const onPlus = (val: number, valueSetter: any) => {
    return () => setControlledValue(val + 1, valueSetter);
  };
  return (
    <Grid cellPadding={30}>
      <GridItem sm={6}>
        <Form isHorizontal>
          <FormGroup
            label="Number of professionals"
            fieldId="nbProParticipants"
            labelIcon={
              <Popover
                headerContent={
                  <div>The number of professionals participants</div>
                }
                bodyContent={
                  <div>
                    Between {min} and {max}
                  </div>
                }
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
            }
            isInline
          >
            <NumberInput
              id="nbProParticipants"
              value={nbProParticipants}
              onMinus={onMinus(nbProParticipants, setNbProParticipants)}
              onChange={(event) => {
                const target = event.target as HTMLTextAreaElement;
                setControlledValue(Number(target.value), setNbProParticipants);
              }}
              onPlus={onPlus(nbProParticipants, setNbProParticipants)}
              inputName="input"
              inputAriaLabel="number input"
              minusBtnAriaLabel="minus"
              plusBtnAriaLabel="plus"
              min={min}
              max={max}
              widthChars={2}
            />
          </FormGroup>
          <FormGroup
            label="Number of non-professionals"
            fieldId="nbNonProParticipants"
            labelIcon={
              <Popover
                headerContent={
                  <div>The number of non-professionals participants</div>
                }
                bodyContent={
                  <div>
                    Between {min} and {max}
                  </div>
                }
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
            }
            isInline
          >
            <NumberInput
              id="nbNonProParticipants"
              value={nbNonProParticipants}
              onMinus={onMinus(nbNonProParticipants, setNbNonProParticipants)}
              onChange={(event) => {
                const target = event.target as HTMLTextAreaElement;
                setControlledValue(
                  Number(target.value),
                  setNbNonProParticipants
                );
              }}
              onPlus={onPlus(nbNonProParticipants, setNbNonProParticipants)}
              inputName="input"
              inputAriaLabel="number input"
              minusBtnAriaLabel="minus"
              plusBtnAriaLabel="plus"
              min={min}
              max={max}
              widthChars={2}
            />
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
              <button
                className="pf-c-button pf-m-primary"
                type="button"
                onClick={props.startSolving}
              >
                Solve
              </button>
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
          <div>
            <b>Explanation:</b> {props.committeeSolution.scoreExplanation}
          </div>
        )}
      </GridItem>
    </Grid>
  );
}

export default SolutionSettingsForm;
