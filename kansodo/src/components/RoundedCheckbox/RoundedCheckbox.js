import React, { useState } from 'react';
import './RoundedCheckbox.css';

const RoundedCheckbox = ({ label, onChange, isChecked = false }) => {
  const [checked, setChecked] = useState(isChecked);

  const handleChange = (event) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <label className="rounded-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <span className="checkmark"></span>
    </label>
  );
};

export default RoundedCheckbox;