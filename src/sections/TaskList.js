import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { MeetTaskBubble } from '../taskBubble/MeetTaskBubble';
import { WorkTaskBubble } from '../taskBubble/WorkTaskBubble';
import { CommTaskBubble } from '../taskBubble/CommTaskBubble';

export function TaskList(props) {
    const { type, date } = props;

    switch(type) {
        case "meet": {
            return (
                <Box padding={'0px 50px'} width={'30%'}>
                    {MeetTaskBubble(date)}
                </Box>
            );
        }
        case "work": {
            return (
                <Box padding={'0px 50px'} width={'30%'} style={ type==="work" ? {border: '3px solid #ebebeb', borderTop: 0, borderBottom: 0} : {}}>
                    {WorkTaskBubble(date)}
                </Box>
            );
        }
        case "comm": {
            return (
                <Box padding={'0px 50px'} width={'30%'}>
                    {CommTaskBubble(date)}
                </Box>
            );
        }
    }
    
}

TaskList.propTypes = {
    type: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
};