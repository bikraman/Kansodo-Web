import React, { useState } from 'react';
// import './RoundedCheckbox.css';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Checkbox from '@mui/material/Checkbox'

const RoundedCheckbox = ({ onChange, isChecked = false }) => {
  const [checked, setChecked] = useState(isChecked);

  const handleCheckboxChange = (event) => {
    console.log(event)
  }
  

  return (
    <Checkbox
      checked={checked}
      icon={<RadioButtonUncheckedIcon/>}
      checkedIcon={<CheckCircleIcon/>}
      onChange={handleCheckboxChange}
      defaultChecked
    />
  );
};

export default RoundedCheckbox;