import '../../App.css';
import React, { useState, useContext, useEffect } from 'react';
import '../css/dialog.sass';
import { GetTaskStatusData } from '../../taskBubble/TaskStatusData';
import moment from 'moment';

import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Menu from "@material-ui/core/Menu";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from "@material-ui/pickers";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import { 
    FormatAlignLeftIcon,
    IconButton,
    CloseIcon,
    FlagIcon,
    PlaceIcon,
    TimerIcon,
    TodayIcon
} from '../../imports/icons';

import { DataContext } from "../../providers/DataProvider";
import { UserContext } from "../../providers/UserProvider";
import { renderTaskStatusBubble, menuProps, startTimeSlots, endTimeSlots } from '../../const/dialogConsts';


export function MeetEditDialog(props) {

    const { onClose, selectedTask, open } = props;
    const { setRefresh } = useContext(DataContext);
    const user = useContext(UserContext);

    const handleClose = () => {
        onClose();
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClickOnMore = (event) => {
        setAnchorEl(event.currentTarget);
    };  

    const handleCloseMore = () => {
        setAnchorEl(null);
    };

    const taskStatusData = GetTaskStatusData(selectedTask.status);

    const handleStatusChange = (event) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
                body: JSON.stringify({ 
                    token: user.uid,
                    collection: "meeting_tasks",
                    taskId: selectedTask.id,
                    status: event.target.value,
                    })
            };
            fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/update-task-status', requestOptions)
                .then(response => response.json())
                .then(data => setRefresh(data.taskId));
        } catch(error) {
            console.log(error);
            alert("Something went wrong. Please try again later.")
        }
        selectedTask.status = event.target.value;
    };

    const [titleState, setTitle] = useState('');
    const [descState, setDesc] = useState('');
    const [selectedStartTime, setStartTime] = useState("13:00")
    const [selectedEndTime, setEndTime] = useState("14:00")
    const [selectedDate, handleDateChange] = useState(new Date());
    const [taskAddress, setAddress] = useState('');

    useEffect(() => {
        setTitle(selectedTask.title);
        setDesc(selectedTask.desc);
        setStartTime(selectedTask.startTime);
        setEndTime(selectedTask.endTime);
        handleDateChange(moment(selectedTask.date, 'D.M.YYYY'));
        setAddress(selectedTask.address)
    }, [open])

    async function updateTask() {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
                body: JSON.stringify({ 
                    token: user.uid,
                    taskId: selectedTask.id,
                    title: titleState,
                    desc: descState,
                    date: moment(selectedDate).format("DD/MM/yyy"),
                    status: selectedTask.status,
                    address: taskAddress.value == undefined ? taskAddress : taskAddress.value.description,
                    startTime: selectedStartTime,
                    endTime: selectedEndTime,
                    category: "",
                })
            };
            await fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/update-meeting-task', requestOptions)
            .then(response => response);
        } catch(error) {
            console.log(error);
            alert("Something went wrong. Please try again later.")
        }

        setRefresh(selectedTask.id);
        handleClose();
    };

    async function deleteTask() {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
                body: JSON.stringify({ taskId: selectedTask.id, token: user.uid })
            };
            await fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/delete-meeting-task', requestOptions)
            .then(response => response);
        } catch(error) {
            console.log(error);
            alert("Something went wrong. Please try again later.")
        }

        setRefresh(selectedTask.id);
        handleClose();
    };


    return (
            <Dialog
                onClose={handleClose}
                open={open}
                fullWidth={true}
                maxWidth={'md'}
                PaperProps={{ style: { height:'60%', backgroundColor: '#fff', color: 'black', borderRadius: '30px', padding: '35px', boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.15)', transition: 'all 1s'}, elevation: 0 }}
                BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.25)" } }}
            >
                <div style={{ }}>
                    <TextField style={{width: "70%", marginBottom: '1em'}} className="task-title-input" value={titleState} onChange={e => setTitle(e.target.value)} />

                    <Button className="update-task-button" onClick={() => {updateTask()}}>
                        Uložiť
                    </Button>
                    
                    <IconButton aria-label="close" className="close-button" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>

                    <Button className="more-button" onClick={(e) => {handleClickOnMore(e)}}>
                        Viac
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        getContentAnchorEl={null}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMore}
                    >
                        <MenuItem onClick={() => {deleteTask(); handleClose()}} style={{ fontFamily: "Poppins", color: '#b32929' }}>
                        Vymazať
                        </MenuItem>
                    </Menu>

                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                        <FlagIcon />
                        <FormControl>
                            <Select
                                disableUnderline
                                classes={{ root: "task-select" }}
                                MenuProps={menuProps}
                                value={taskStatusData.id}
                                onChange={handleStatusChange}
                            >
                                <MenuItem value={"done"}>{renderTaskStatusBubble(GetTaskStatusData('done'))}</MenuItem>
                                <MenuItem value={"in_progress"}>{renderTaskStatusBubble(GetTaskStatusData('in_progress'))}</MenuItem>
                                <MenuItem value={"not_done"}>{renderTaskStatusBubble(GetTaskStatusData('not_done'))}</MenuItem>
                            </Select>
                        </FormControl>
                    </span>

                    <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'start', padding: '10px 0px' }}>
                        <FormatAlignLeftIcon style={{ marginTop: '0.3em' }} />
                        <TextField multiline rows={2} rowsMax={5} variant="outlined" style={{width: "66%", marginLeft:'0.9em'}} className="task-desc-input" value={descState} onChange={e => setDesc(e.target.value)} />
                    </span>
                    
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                        <PlaceIcon />
                        <GooglePlacesAutocomplete
                            selectProps={{
                                placeholder: taskAddress == "" ? 'Pridať miesto' : taskAddress,
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
                                        width: '30%',
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
                                        width: '98%',
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
                                setStartTime(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" style={{background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px', border:'none'}} />
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
                                setEndTime(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" style={{background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px'}}/>
                            )}
                        />
                    </span>
                    
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                        <TodayIcon />
                        <DatePicker
                            autoOk
                            disableToolbar
                            variant="inline"
                            inputVariant="outlined"
                            outline="none"
                            style={{ width: 90, marginLeft: 10, background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px'}}
                            format="D.M.YYYY"
                            value={selectedDate}
                            onChange={date => handleDateChange(date)}
                        />
                    </span>

                </div>
            </Dialog>
        
    );
}

MeetEditDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedTask: PropTypes.object.isRequired
};