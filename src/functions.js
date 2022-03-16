import moment from "moment";

export function getTasksByDate(taskData, type, date) {
    switch(type) {
        case 'meet': {
            if (taskData.meetTasks !== undefined) {
                return taskData.meetTasks.filter((task) =>
                  task.date.includes(moment(date).format("DD/MM/yyyy"))
                ); //filter tasks by specified type
            }
        }
        case 'work': {
            if (taskData.workTasks !== undefined) {
                return taskData.workTasks.filter((task) =>
                  task.date.includes(moment(date).format("DD/MM/yyyy"))
                ); //filter tasks by specified type
            }
        }
        case 'comm': {
            if (taskData.commTasks !== undefined) {
                return taskData.commTasks.filter((task) =>
                  task.date.includes(moment(date).format("DD/MM/yyyy"))
                ); //filter tasks by specified type
            }
        }
    }
}