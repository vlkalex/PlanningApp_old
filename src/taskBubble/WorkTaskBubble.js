import { useStyles } from "../App";
import "../App.css";
import React, { useContext, useState } from "react";
import { GetTaskStatusData } from "./TaskStatusData";
import { WorkDetailDialog } from "../dialogWindows/WorkDetailDialog";
import Box from "@material-ui/core/Box";
import moment from "moment";
import "moment/locale/sk";

import { Droppable, Draggable } from "react-beautiful-dnd";
import TimerIcon from "@material-ui/icons/Timer";

import { DataContext } from "../providers/DataProvider";

export function WorkTaskBubble(date) {
  const classes = useStyles();

  const { taskData } = useContext(DataContext);

  let filteredData = [];

  const [state, setState] = useState([]);

  if (taskData.workTasks !== undefined) {
    filteredData = taskData.workTasks.filter((task) => 
      task.date.includes(moment(date).format("DD/MM/yyyy"))
	); //filter tasks by specified type
  }

  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState({
    id: "-1",
    title: "Test",
    desc: "Test",
    workTime: "100h",
    status: "not_done",
  });

  const handleClickOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
  
	return result;
  };
  
  const move = (source, destination, droppableSource, droppableDestination) => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);
  
	destClone.splice(droppableDestination.index, 0, removed);
  
	const result = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;
  
	return result;
  };

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

	console.log(sInd)
	console.log(dInd)

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group.length));
    }
  };

  if (filteredData === undefined || filteredData.length === 0) {
    return (
      <div style={{ justifyContent: "center", height: "100%" }}>
        <Droppable droppableId={moment(date).unix() + 'w'} type="WORK">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <h3
              style={{
                textAlign: "center",
                paddingTop: "18px",
                color: "#bdbdbd",
                fontFamily: "Poppins",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Prázdne
            </h3>
            {provided.placeholder}
          </div>
        )}
        </Droppable>
      </div>
    );
  } else {
    return (
      <div>
        <Droppable droppableId={moment(date).unix() + 'w'} type="WORK">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {filteredData.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      marginBottom: '1em',
                      ...provided.draggableProps.style
                    }}
                    >
                      <div
                        className={classes.taskBubble}
                        style={{
                        backgroundColor: GetTaskStatusData(item.status).color,
                        }}
                        onClick={() => handleClickOpen(item)}
                      >
                        <Box flexGrow={1}>
                          <h3 className={classes.bubbleTitle}>
                            {item.title}
                          </h3>
                        </Box>
                        <TimerIcon style={{ marginRight: "5px" }} />
                        <h3 className={classes.bubbleWorkTime}>
                          {item.workTime}
                        </h3>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <WorkDetailDialog
          onClose={handleClose}
          open={open}
          selectedTask={selectedTask}
        />
      </div>
    );
  }
}
