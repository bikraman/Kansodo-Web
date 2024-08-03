import React, { useState } from 'react';
// import './RoundedCheckbox.css';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Checkbox from '@mui/material/Checkbox'

const RoundedCheckbox = ({ onChange, isChecked = true }) => {
  const [checked, setChecked] = useState(isChecked);

  const handleChange = (event) => {
    console.log(event)
    setChecked(event.target.checked);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
    />
  );
};

export default RoundedCheckbox;