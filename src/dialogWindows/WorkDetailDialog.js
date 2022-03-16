import '../App.css';
import React, { useState, useContext } from 'react';
import './css/dialog.sass';
import { GetTaskStatusData } from '../taskBubble/TaskStatusData';
import moment from 'moment';

import { WorkEditDialog } from './editModeDialogs/WorkEditDialog';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import { renderTaskStatusBubble, menuProps } from '../const/dialogConsts';

import { 
    FormatAlignLeftIcon,
    IconButton,
    DeleteIcon,
    CreateIcon,
    CloseIcon,
    FlagIcon,
    TimerIcon,
    TodayIcon
} from '../imports/icons';

import { DataContext } from "../providers/DataProvider";
import { UserContext } from "../providers/UserProvider";


export function WorkDetailDialog(props) {
    const { onClose, selectedTask, open } = props;
    const { setRefresh } = useContext(DataContext);
    const user = useContext(UserContext);

    const taskStatusData = GetTaskStatusData(selectedTask.status);

    const [openEdit, setOpenEdit] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleStatusChange = (event) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
                body: JSON.stringify({ 
                    collection: "work_tasks",
                    token: user.uid,
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


    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Dialog
                onClose={handleClose}
                open={open}
                fullWidth={true}
                maxWidth={'xs'}
                PaperProps={{ style: { backgroundColor: '#FFEAC8', color: 'black', borderRadius: '30px', padding: '35px', boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.15)', }, elevation: 0 }}
                BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.25)" } }}
            >
                <h1 className="detail-title">{selectedTask.title}</h1>
                
                <IconButton aria-label="edit" className="edit-button" onClick={() => {handleClose();handleClickOpenEdit()}}>
                    <CreateIcon />
                </IconButton>
            
                <IconButton aria-label="close" className="close-button" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>

                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px 0px' }}>
                    <FlagIcon style={{ paddingTop: '2px' }} />
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

                { selectedTask.desc
                  ? <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'start', padding: '10px 0px' }}>
                        <FormatAlignLeftIcon style={{ paddingTop: '2px' }} />
                        <h3 className="detail-text">
                            {selectedTask.desc}
                        </h3>
                    </span>
                  : ''
                }
                
                <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'start', padding: '10px 0px' }}>
                    <TimerIcon />
                    <h3 className="detail-text">
                        {selectedTask.workTime}
                    </h3>
                </span>
            </Dialog>
            <WorkEditDialog onClose={handleCloseEdit} open={openEdit} selectedTask={selectedTask} />
        </MuiPickersUtilsProvider>
    );
}

WorkDetailDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedTask: PropTypes.object.isRequired,
};