import React from 'react';
import '../dialogWindows/css/dialog.sass';

export const renderTaskStatusBubble = (taskStatusData) => {
    return (
        <span className={"task-status"} style={{backgroundColor: taskStatusData.color}}>
            {taskStatusData.title}
        </span>
    )
}

export const menuProps = {
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
};

export const startTimeSlots = Array.from(new Array(24 * 4)).map(
    (_, index) => `${Math.floor(index / 4)}:${getMinutes(index)}`
);

export const endTimeSlots = Array.from(new Array(24 * 4)).map(
    (_, index) => `${Math.floor(index / 4)}:${getMinutes(index)}`
);

export const timeSlots = Array.from(new Array(10 * 4)).map(
    (_, index) => index > 0 ? `${Math.floor(index / 4)}h${getMinutes(index)}m` : ''
);