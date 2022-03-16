import '../../App.css';
import '../css/dialog.sass';
import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import TimerIcon from '@material-ui/icons/Timer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TodayIcon from '@material-ui/icons/Today';
import PlaceIcon from '@material-ui/icons/Place';

import { DataContext } from "../../providers/DataProvider";
import { UserContext } from "../../providers/UserProvider";
import { startTimeSlots, endTimeSlots } from '../../const/dialogConsts';

const CssTextField = withStyles({
    root: {
      '& .MuiFilledInput-root': {
        fontFamily: 'Poppins',
        paddingTop: 0,
        background: 'rgba(171, 171, 171, 0.15)'
      },
    },
})(TextField);

export function MeetAddTaskDialog(props) {

    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskAddress, setAddress] = useState("");
    const [selectedStartTime, handleStartTimeChange] = useState("13:00");
    const [selectedEndTime, handleEndTimeChange] = useState("14:00")
    const [selectedDate, handleDateChange] = useState(new Date());

    const { setRefresh } = useContext(DataContext);
    const user = useContext(UserContext);

    // moves the menu below the select input
    const menuProps = {
        anchorOrigin: {
        vertical: "bottom",
            horizontal: "left"
        },
        transformOrigin: {
        vertical: "top",
            horizontal: "left"
        },
        getContentAnchorEl: null
    };

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
                    address: taskAddress.value == undefined ? "" : taskAddress.value.description,
                    startTime: selectedStartTime,
                    endTime: selectedEndTime,
                    category: "",
                    })
            };
            fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/create-meeting-task', requestOptions)
                .then(response => response.json())
                .then(data => setRefresh(data.taskId));
        } catch(error) {
            console.log(error);
            alert("Something went wrong. Please try again later.")
        }

        setTaskTitle("");
        setTaskDesc("");
        handleStartTimeChange("13:00");
        handleEndTimeChange("14:00");
        setAddress("");
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
                        InputProps={{
                            shrink:'false'
                        }}
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

                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px', paddingLeft: '10px' }}>
                        <PlaceIcon />

                        <GooglePlacesAutocomplete
                            selectProps={{
                                placeholder: 'Pridať miesto',
                                styles: {
                                    control: (provider, state) => ({
                                        ...provider,
                                        background: 'none',
                                        fontFamily: 'Poppins',
                                        width: '97.8%',
                                        height: '3.8em',
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                        "&:hover": {
                                            borderColor: state.isFocused ? "-webkit-focus-ring-color" : "black"
                                        }
                                    }),
                                    container: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                        marginLeft: '10px',
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Poppins',
                                        color: '#2b2b2b',
                                    }),
                                    option: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Poppins',
                                        color: '#2b2b2b',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        width: '97.8%',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Poppins',
                                        color: '#2b2b2b',
                                    }),
                                    dropdownIndicator: (provider) => ({
                                        ...provider,
                                        color: 'rgba(0, 0, 0, 0.23)',
                                    }),
                                    indicatorSeparator: (provider) => ({
                                        ...provider,
                                        color: 'rgba(0, 0, 0, 0.23)',
                                    }),
                                },
                                taskAddress,
                                onChange: setAddress,
                            }}
                        />
                    </span>

                    <div style={{alignItems:'center', display: 'flex', flexDirection:'row', justifyContent: 'space-between', paddingLeft: '10px', paddingRight: '10px'}}>
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

                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                            <TimerIcon />
                            <Autocomplete
                                id="time-picker"
                                options={startTimeSlots}
                                style={{ width: 90, marginLeft: 10 }}
                                disableClearable
                                freeSolo
                                value={selectedStartTime}
                                inputValue={selectedStartTime}
                                onInputChange={(event, newInputValue) => {
                                    handleStartTimeChange(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <CssTextField {...params} variant="outlined" style={{background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px'}} />
                                )}
                            />
                            <h3 style={{marginLeft:'8px', marginRight:'8px', fontSize:'20px', fontWeight:400}}>-</h3>
                            <Autocomplete
                                id="time-picker"
                                options={endTimeSlots}
                                style={{ width: 90 }}
                                disableClearable
                                freeSolo
                                value={selectedEndTime}
                                inputValue={selectedEndTime}
                                onInputChange={(event, newInputValue) => {
                                    handleEndTimeChange(newInputValue);
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

MeetAddTaskDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};