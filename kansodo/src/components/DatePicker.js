import {useState} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import calendar from '../assets/calendar.png'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DatePickerComponent() {

    const [showCal, setShowCal] = useState(false)

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <img src={calendar} onClick={() => { setShowCal(!showCal); console.log(showCal) } }></img>
        </LocalizationProvider>
    );
}