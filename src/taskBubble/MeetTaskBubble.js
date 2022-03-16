import { useStyles } from "../App";
import "../App.css";
import React, { useContext } from "react";
import { GetTaskStatusData } from "./TaskStatusData";
import { MeetDetailDialog } from "../dialogWindows/MeetDetailDialog";
import Box from "@material-ui/core/Box";
import moment from "moment";
import "moment/locale/sk";

import { Droppable, Draggable } from "react-beautiful-dnd";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PlaceIcon from "@material-ui/icons/Place";

import { DataContext } from "../providers/DataProvider";

export function MeetTaskBubble(date) {
  const classes = useStyles();

  const { taskData } = useContext(DataContext);

  let filteredData = [];

  if (taskData.meetingTasks !== undefined) {
    filteredData = taskData.meetingTasks.filter((task) =>
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
    startTime: "",
    endTime: "",
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
        <Droppable droppableId={moment(date).unix() + 'm'} type="MEET">
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
        <Droppable droppableId={moment(date).unix() + 'm'} type="MEET">
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
                          display: "flex",
                          flexDirection: "column",
                        }}
                        onClick={() => handleClickOpen(item)}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                          }}
                        >
                          <Box flexGrow={1}>
                            <h3 className={classes.bubbleTitle}>
                              {item.title}
                            </h3>
                          </Box>
                          <ScheduleIcon style={{ marginRight: "5px" }} />
                          <h3 className={classes.bubbleWorkTime}>
                            {item.startTime} - {item.endTime}
                          </h3>
                        </Box>
                        {item.address !== "" ? (
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "flex-end",
                              marginTop: "5px",
                            }}
                          >
                            <PlaceIcon />
                            <h3 className={classes.bubbleWorkTime}>
                              {item.address}
                            </h3>
                          </Box>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <MeetDetailDialog
          onClose={handleClose}
          open={open}
          selectedTask={selectedTask}
        />
      </div>
    );
  }
}
