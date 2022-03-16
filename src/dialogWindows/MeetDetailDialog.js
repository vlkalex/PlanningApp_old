import '../App.css';
import './css/dialog.sass';
import React, { useState, useContext } from 'react';
import { GetTaskStatusData } from '../taskBubble/TaskStatusData';
import moment from 'moment';

import { MeetEditDialog } from './editModeDialogs/MeetEditDialog';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

import { 
    FormatAlignLeftIcon,
    IconButton,
    CreateIcon,
    CloseIcon,
    FlagIcon,
    PlaceIcon,
    ScheduleIcon,
    TimerIcon
} from '../imports/icons';

import { DataContext } from "../providers/DataProvider";
import { UserContext } from "../providers/UserProvider";
import { renderTaskStatusBubble, menuProps } from '../const/dialogConsts';

export function MeetDetailDialog(props) {

    const { onClose, selectedTask, open } = props;
    const { setRefresh } = useContext(DataContext);
    const user = useContext(UserContext);
    const taskStatusData = GetTaskStatusData(selectedTask.status);
    const workTime = moment.duration(moment(selectedTask.endTime, "HH:mm").diff(moment(selectedTask.startTime, "HH:mm")));

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
    }

    const TaskDescription = () => {
        if (selectedTask.desc !== "") {
            return (
                <span className="task-detail-info">
                    <FormatAlignLeftIcon style={{ paddingTop: '2px' }} />
                    <h3 className="detail-text">
                        {selectedTask.desc}
                    </h3>
                </span>
            );
        } else {
            return ("")
        }
    }

    
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Dialog
                onClose={handleClose}
                open={open}
                fullWidth={true}
                maxWidth={'xs'}
                PaperProps={{ style: { backgroundColor: '#FFEAC8', color: 'black', borderRadius: '30px', padding: '35px', boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.15)', transition: 'all 1s'}, elevation: 0 }}
                BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.25)" } }}
            >
                <div>
                    <h1 className="detail-title">{selectedTask.title}</h1>
                    <IconButton aria-label="edit" className="edit-button" onClick={() => {handleClose();handleClickOpenEdit()}}>
                        <CreateIcon />
                    </IconButton>
                </div>

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

                <TaskDescription />

                { selectedTask.address == ''
                  ? ''
                  : <span className="task-detail-info">
                        <PlaceIcon />
                        <h3 className="detail-text">
                            {selectedTask.address}
                        </h3>
                    </span>
                }

                <span className="task-detail-info">
                    <ScheduleIcon />
                    <h3 className="detail-text">
                        {selectedTask.startTime} - {selectedTask.endTime}
                    </h3>
                </span>

                <span className="task-detail-info">
                    <TimerIcon />
                    <h3 className="detail-text">
                        {parseInt(workTime.asHours())}h{parseInt(workTime.asMinutes())%60}m
                    </h3>
                </span>

            </Dialog>
            <MeetEditDialog onClose={handleCloseEdit} open={openEdit} selectedTask={selectedTask} />
        </MuiPickersUtilsProvider>
    );
}

MeetDetailDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedTask: PropTypes.object.isRequired
};