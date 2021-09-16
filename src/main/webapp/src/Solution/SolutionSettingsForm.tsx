import React, { useState } from "react";
import { NumberInput } from "@patternfly/react-core";

function SolutionSettingsForm(props: any) {
  const [value, setValue] = useState(4);
  const min = 0;
  const max = 5;
  const setControlledValue = (val: number) => {
    val = Math.max(val, min);
    val = Math.min(val, max);
    setValue(val);
  };
  const onMinus = () => {
    setControlledValue(value - 1);
  };
  const onPlus = () => {
    setControlledValue(value + 1);
  };
  return (
    <div>
      <NumberInput
        value={value}
        onMinus={onMinus}
        onChange={(event) => {
          const target = event.target as HTMLTextAreaElement;
          setControlledValue(Number(target.value));
        }}
        onPlus={onPlus}
        inputName="input"
        inputAriaLabel="number input"
        minusBtnAriaLabel="minus"
        plusBtnAriaLabel="plus"
      />
    </div>
  );
}

export default SolutionSettingsForm;
