import React, { useState } from "react";

function NumberInput(props: any) {
  const [value, setValue] = useState(props.value);
  const min = 0;
  const max = 5;
  const setControlledValue = (val: number) => {
    val = Math.max(val, min);
    val = Math.min(val, max);
    setValue(val);
  };
  return (
    <div className="pf-c-number-input">
      <div className="pf-c-input-group">
        <button
          className="pf-c-button pf-m-control"
          type="button"
          aria-label="Minus"
          onClick={() => {
            setControlledValue(value - 1);
          }}
        >
          <span className="pf-c-number-input__icon">
            <i className="fas fa-minus" aria-hidden="true"></i>
          </span>
        </button>
        <input
          className="pf-c-form-control"
          type="number"
          value={value}
          name="number-input-default-name"
          aria-label="Number input"
          onChange={(event) => {
            setControlledValue(Number(event.target.value));
          }}
        />
        <button
          className="pf-c-button pf-m-control"
          type="button"
          aria-label="Plus"
          onClick={() => {
            setControlledValue(value + 1);
          }}
        >
          <span className="pf-c-number-input__icon">
            <i className="fas fa-plus" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
  );
}

export default NumberInput;
