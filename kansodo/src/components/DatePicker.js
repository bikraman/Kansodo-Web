import {useEffect, useState} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import calendar from '../assets/calendar.png'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function DatePickerComponent({shouldShow, onDateChange}) {

    const [showCal, setShowCal] = useState(false)

    useEffect(() => {
        console.log("cal being rendered:" + shouldShow)
        setShowCal(shouldShow)
    }, [shouldShow])

    if (showCal)
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{position: 'fixed' , 
                    top: '0',
                    left: '0',
                    alignItems: 'center',

                    zIndex: '10' ,
                    display: 'flex', 
                    width: '100%',
                    height: '100%'}}>
                    <DateCalendar 
                        sx={{
                            backgroundColor: 'white',
                            borderColor: 'black',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderRadius: '10px' // Change this to your desired background color
                            // '& .MuiCalendarPicker-root': {
                            // backgroundColor: 'lightblue', // This targets the main calendar container
                            // },
                            // '& .MuiPickersCalendarHeader-root': {
                            // backgroundColor: 'lightgreen', // This targets the header
                            // },
                            // '& .MuiPickersDay-root': {
                            // backgroundColor: 'lightcoral', // This targets each day cell
                            // },
                            // Add more custom styles as needed
                        }}
                        onChange={onDateChange}
                    />
                </div>
            </LocalizationProvider>
        );
    else 
        return (<></>);
}