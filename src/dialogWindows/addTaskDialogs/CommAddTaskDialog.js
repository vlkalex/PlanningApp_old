import '../../App.css';
import React, { useState, useContext } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import moment from 'moment';

import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';

import TimerIcon from '@material-ui/icons/Timer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TodayIcon from '@material-ui/icons/Today';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';

import { DataContext } from "../../providers/DataProvider";
import { UserContext } from "../../providers/UserProvider";

const CssTextField = withStyles({
    root: {
      '& .MuiFilledInput-root': {
        fontFamily: 'Poppins',
        paddingTop: 0,
        background: 'rgba(171, 171, 171, 0.15)'
      },
    },
})(TextField);

export function CommAddTaskDialog(props) {

    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [contactPhoneNumber, setPhoneNumber] = useState("");
    const [contactEmail, setEmail] = useState("");
    const [selectedTime, handleTimeChange] = useState("1h30m");
    const [selectedDate, handleDateChange] = useState(new Date());

    const { setRefresh } = useContext(DataContext);
    const user = useContext(UserContext);

    const handleForm = e => {
        e.preventDefault();
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
                body: JSON.stringify({ 
                    token: user.uid,
                    title: taskTitle,
                    desc: taskDesc,
                    date: moment(selectedDate).format("DD/MM/yyyy"),
                    email: contactEmail,
                    phoneNumber: contactPhoneNumber,
                    workTime: selectedTime,
                    })
            };
            fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/create-comm-task', requestOptions)
                .then(response => response.json())
                .then(data => setRefresh(data.taskId));
        } catch(error) {
            console.log(error);
            alert("Something went wrong. Please try again later.")
        }

        setTaskTitle("");
        setTaskDesc("");
        handleTimeChange("1h30m");
        handleDateChange(new Date());
        handleClose();
    };

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            
            <Dialog
            onClose={handleClose}
            open={open}
            fullWidth={true}
            maxWidth={'xs'}
            PaperProps={{ style: { backgroundColor: '#fff', color: 'black', borderRadius: '30px', padding: '35px', boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.15)', }, elevation: 0 }}
            BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.25)" } }}
            >
                <form onSubmit={e => handleForm(e)} style={{display: 'contents'}}>
                    <h1 className="detail-title">Vytvoriť úlohu</h1>
                    <IconButton aria-label="close" className="close-button" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>

                    <TextField
                        label="Názov"
                        variant="outlined"
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                        className="add-task-input"
                    />

                    <TextField
                        label="Popis"
                        multiline
                        rows={3}
                        variant="outlined"
                        value={taskDesc}
                        onChange={e => setTaskDesc(e.target.value)}
                        className="add-task-input"
                    />

                    <div style={{alignItems:'center', display: 'flex', flexDirection:'row', justifyContent: 'space-between', paddingLeft: '10px'}}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                            <PhoneIcon />
                            <TextField
                                label="Tel. číslo"
                                variant="outlined"
                                value={contactPhoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                className="add-task-input"
                            />
                        </span>

                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                            <EmailIcon />
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={contactEmail}
                                onChange={e => setEmail(e.target.value)}
                                className="add-task-input"
                            />
                        </span>
                    </div>

                    <div style={{alignItems:'center', display: 'flex', flexDirection:'row', marginLeft: '10px'}}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                            <TodayIcon />
                            <DatePicker
                                autoOk
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                style={{ width: 90, marginLeft: 10, background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px', border: 'none' }}
                                format="D.M.YYYY"
                                value={selectedDate}
                                onChange={date => handleDateChange(date)}
                            />
                        </span>

                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px', marginLeft: '20px' }}>
                            <TimerIcon />
                            <Autocomplete
                                id="time-picker"
                                options={timeSlots}
                                style={{ width: 90, marginLeft: 10 }}
                                disableClearable
                                freeSolo
                                value={selectedTime}
                                inputValue={selectedTime}
                                onInputChange={(event, newInputValue) => {
                                    handleTimeChange(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <CssTextField {...params} variant="outlined" style={{background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px'}} />
                                )}
                            />
                        </span>
                    </div>

                    <Button type="submit" className="create-task-button">
                        Vytvoriť
                    </Button>
                
                </form>
            </Dialog>
            
        </MuiPickersUtilsProvider>
        
    );
}

CommAddTaskDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};


const getMinutes = (index) => {
    if (index % 4 === 0) {
        return '00'
    } else if ( index % 2 === 0 ) {
        return '30'
    } else if ( index % 4 === 1 ) {
        return '15'
    } else {
        return '45'
    }
}

const timeSlots = Array.from(new Array(10 * 4)).map(
     (_, index) => index > 0 ? `${Math.floor(index / 4)}h${getMinutes(index)}m` : ''
  );