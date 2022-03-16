import React from 'react';
import { useStyles } from '../App';
import { TaskList } from './TaskList';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

export function RenderTaskList(props) {
    const classes = useStyles();

    const { date } = props;

    return (
        <Box className={classes.taskListWindow} tabIndex="0" id={date}>
            <TaskList type={"meet"} date={date}/>
            <TaskList type={"work"} date={date}/>
            <TaskList type={"comm"} date={date}/>
        </Box>
    )
}

RenderTaskList.propTypes = {
    date: PropTypes.number.isRequired,
}