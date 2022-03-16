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

import { 
    FormatAlignLeftIcon,
    IconButton,
    CloseIcon,
    FlagIcon,
    TimerIcon,
    TodayIcon
} from '../../imports/icons';

import { DataContext } from "../../providers/DataProvider";
import { UserContext } from "../../providers/UserProvider";
import { renderTaskStatusBubble, menuProps, timeSlots } from '../../const/dialogConsts';


export function WorkEditDialog(props) {

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
                    collection: "work_tasks",
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
    const [workTimeState, setWorkTime] = useState('');
    const [selectedDate, handleDateChange] = useState(new Date());

    useEffect(() => {
        setTitle(selectedTask.title);
        setDesc(selectedTask.desc);
        setWorkTime(selectedTask.workTime);
        handleDateChange(moment(selectedTask.date, 'D.M.YYYY'));
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
                    workTime: workTimeState,
                })
            };
            await fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/update-work-task', requestOptions)
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
            await fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/delete-work-task', requestOptions)
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

                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                    <TimerIcon />
                    <Autocomplete
                        id="time-picker"
                        options={timeSlots}
                        style={{ width: 90, marginLeft: 10}}
                        disableClearable
                        freeSolo
                        value={workTimeState}
                        inputValue={workTimeState}
                        onInputChange={(event, newInputValue) => {
                            setWorkTime(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" style={{background: 'rgba(171, 171, 171, 0.15)', borderRadius: '5px'}} />
                        )}
                    />
                </span>

            </div>
        </Dialog>
    );
}

WorkEditDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedTask: PropTypes.object.isRequired
};