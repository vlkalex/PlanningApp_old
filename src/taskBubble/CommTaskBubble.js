import { useStyles } from "../App";
import "../App.css";
import React, { useContext, useEffect } from "react";
import { GetTaskStatusData } from "./TaskStatusData";
import { CommDetailDialog } from "../dialogWindows/CommDetailDialog";
import Box from "@material-ui/core/Box";
import moment from "moment";
import "moment/locale/sk";

import { Droppable, Draggable } from "react-beautiful-dnd";
import TimerIcon from "@material-ui/icons/Timer";

import { getTasksByDate } from '../functions';

import { DataContext } from "../providers/DataProvider";


export function CommTaskBubble(date) {
  const classes = useStyles();

  const { taskData } = useContext(DataContext);

  let filteredData = []
  
  filteredData = getTasksByDate(taskData, 'comm', date);

  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState({
    id: "-1",
    title: "Test",
    desc: "Test",
    workTime: "100h",
    status: "not_done",
    contact: { phoneNumber: "", email: "" },
  });

  const handleClickOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (filteredData === undefined || filteredData.length === 0) {
    return (
      <div style={{ justifyContent: "center", height: "100%" }}>
        <Droppable droppableId={moment(date).unix() + 'c'} type="COMM">
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
        <Droppable droppableId={moment(date).unix() + 'c'} type="COMM">
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
                      <Box
                        className={classes.taskBubble}
                        style={{
                          backgroundColor: GetTaskStatusData(item.status).color,
                        }}
                        onClick={() => {handleClickOpen(item);console.log(taskData)}}
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
                      </Box>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <CommDetailDialog
          onClose={handleClose}
          open={open}
          selectedTask={selectedTask}
        />
      </div>
    );
  }
}
