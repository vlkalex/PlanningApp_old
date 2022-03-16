import data from '../TaskStatusData.json';

export function GetTaskStatusData(status) {
    if(status === 'done') {
        return data.done;
    } else if(status === 'in_progress') {
        return data.in_progress;
    } else if (status === 'not_done') {
        return data.not_done;
    }
}