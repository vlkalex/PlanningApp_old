import React, { useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import './index';
import { Helmet } from 'react-helmet';
import Box from '@material-ui/core/Box';

import { SideBar } from './sideBar/SideBar';
import { TopBar } from './sections/TopBar';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import 'moment/locale/sk';
import { RenderTaskList } from './sections/RenderTaskList';

import { DragDropContext } from "react-beautiful-dnd";

import { DataContext } from "./providers/DataProvider";
import { UserContext } from "./providers/UserProvider";

export const useStyles = makeStyles((theme) => ({
  main: {
    height: '-webkit-fill-available',
    scrollBehavior: 'smooth',
  },
  root: {
    padding: '2px 10px',
    display: 'flex',
    alignItems: 'center',
    width: 300,
    height: '-webkit-fill-available',
    borderColor: '#f1d6ab',
    borderRadius: 50,
    background: '#00000040',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#f1d6ab',
    fontFamily: 'Sen',
    fontSize: 18,
  },
  taskListWindow: {
    justifyContent: 'center',
    margin: '5px 30px 20px 30px',
    display: 'flex',
    width: '95%',
    minHeight: '8em',
    background: '#fff',
    borderRadius: '20px',
    padding: '20px 0px',
    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.05)',
    "&:focus":{
      outline: '0px',
    },
  },
  taskBubble: {
    display: 'flex',
    borderRadius: '15px',
    padding: '1.1em 1.6em',
    marginBottom: '1em',
    fontFamily:'Poppins',
    backgroundColor: '#fff',
    color: '#2b2b28',
    width: '95%',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    right: '12px',
    transition: "background-color 1s",
  },
  bubbleTitle: {
    color: '#2b2b2b',
    fontWeight: '600',
    fontSize: '0.9em',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    textTransform: 'capitalize',
  },
  bubbleDesc: {
    fontWeight: '600',
    fontSize: 15,
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  bubbleWorkTime: {
    fontWeight: '600',
    fontSize: '0.8em',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    paddingTop: '2px',
  },
  taskSelect: {
    fontFamily: 'Poppins',
  },
}));

function DateText(day) {
  const number = moment(day).format('D');
  const dayText = moment(day).format('dddd');

  if(moment(day).dayOfYear() === moment().dayOfYear()) {
    return (
      <div style={{alignItems:'flex-end', display: 'flex', flexDirection:'row', width:'auto', backgroundColor:'rgba(241, 214, 171, 0.5)', margin:'2em 0 0 5m', borderRadius:'10px', padding:'0.5em 1em'}}>
        <h3 style={{fontFamily:'Poppins', fontWeight:'800', fontSize:'1.5em', color:'#2b2b2b'}}>
          {number}.
        </h3>
  
        <h3 style={{fontFamily:'Poppins', fontWeight:'600', fontSize:'1.3em', color:'#6c6c6c', textTransform:'capitalize', marginLeft:'0.5em', marginBottom:'0.1em' }}>
          {dayText}
        </h3>
      </div>
    )
  } else {
    return (
      <div style={{alignItems:'flex-end', display: 'flex', flexDirection:'row', width:'auto', margin:'2em 0em 0em 5m', padding:'0.5em 1em'}}>
        <h3 style={{fontFamily:'Poppins', fontWeight:'800', fontSize:'1.5em', color:'#2b2b2b'}}>
          {number}.
        </h3>
  
        <h3 style={{fontFamily:'Poppins', fontWeight:'600', fontSize:'1.3em', color:'#6c6c6c', textTransform:'capitalize', marginLeft:'0.5em', marginBottom:'0.1em'}}>
          {dayText}
        </h3>
      </div>
    )
  }
}

export function App() {
  const user = useContext(UserContext);
  const { setTaskData, currWeek, taskData } = useContext(DataContext);

  const classes = useStyles();

  function onDragEnd(result) {
    const { source, destination, draggableId } = result;
  
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sId = +source.droppableId.slice(0,-1);
    const dId = +destination.droppableId.slice(0,-1);
    var dropType = source.droppableId.charAt(source.droppableId.length-1);

    console.log(taskData.commTasks)
  
    if (sId === dId) {
      console.log("SAME")
    } else {
      if(dropType == 'm') {
        let objIndex = taskData.meetingTasks.findIndex((obj => obj.id === draggableId))

        // 1. Make a shallow copy of the items
        let items = {meetingTasks: taskData.meetingTasks, workTasks: taskData.workTasks, commTasks: taskData.commTasks};
        // 2. Make a shallow copy of the item you want to mutate
        let item = {...items.meetingTasks[objIndex]};
        // 3. Replace the property you're intested in
        item.date = moment.unix(dId).format("DD/MM/yyy");
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items.meetingTasks[objIndex] = item;
        // 5. Set the state to our new copy
        setTaskData(items);

        updateDateOfTask('meeting_tasks', draggableId, dId)
      } else if(dropType == 'w') {
        let objIndex = taskData.workTasks.findIndex((obj => obj.id === draggableId))

        // 1. Make a shallow copy of the items
        let items = {meetingTasks: taskData.meetingTasks, workTasks: taskData.workTasks, commTasks: taskData.commTasks};
        // 2. Make a shallow copy of the item you want to mutate
        let item = {...items.workTasks[objIndex]};
        // 3. Replace the property you're intested in
        item.date = moment.unix(dId).format("DD/MM/yyy");
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items.workTasks[objIndex] = item;
        // 5. Set the state to our new copy
        setTaskData(items);

        updateDateOfTask('work_tasks', draggableId, dId)
      } else if(dropType == 'c') {
        let objIndex = taskData.commTasks.findIndex((obj => obj.id === draggableId))

        // 1. Make a shallow copy of the items
        let items = {meetingTasks: taskData.meetingTasks, workTasks: taskData.workTasks, commTasks: taskData.commTasks};
        // 2. Make a shallow copy of the item you want to mutate
        let item = {...items.commTasks[objIndex]};
        // 3. Replace the property you're intested in
        item.date = moment.unix(dId).format("DD/MM/yyy");
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        items.commTasks[objIndex] = item;
        // 5. Set the state to our new copy
        setTaskData(items);

        updateDateOfTask('communication_tasks', draggableId, dId)

      } 
    }
  };
  
  async function updateDateOfTask(taskType, taskId, date) {
    try {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
          body: JSON.stringify({ 
              token: user.uid,
              collection: taskType,
              taskId: taskId,
              date: moment.unix(date).format("DD/MM/yyy"),
          })
      };
      await fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/update-task-date', requestOptions)
      .then(response => response);
    } catch(error) {
      console.log(error);
      alert("Something went wrong. Please try again later.")
    }
  };

  return (
    <Router>
      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgb(252,252,252)', display:'flex', flexDirection:'row',}} >
        <SideBar />
        <Switch>
          <Route exact path="/">
            <div style={{alignItems:'center', display: 'flex', flexDirection:'column', width:'100%', paddingLeft:'10px'}}>
              <Helmet>
                <title>Consult - Week</title>
              </Helmet>

              <TopBar />

              <span style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection:'row', width:'95%', height:'3em'}}>
                  <h2 className={classes.taskTypeTitle}>
                      Meetingy
                  </h2>
                  <h2 className={classes.taskTypeTitle}>
                      Práca
                  </h2>
                  <h2 className={classes.taskTypeTitle}>
                      Komunikácia
                  </h2>
              </span>

              <div style={{width: '100%', flexDirection:'column', overflowY: 'scroll'}}>
                <div style={{alignItems:'center', display: 'flex', flexDirection:'column', paddingLeft: '20px'}}>
                <DragDropContext onDragEnd={onDragEnd}>
                  {currWeek.map((day, i) => (
                    <div key={day} style={{alignItems:'start', display: 'flex', flexDirection:'column', width: '100%'}}>
                      {DateText(day)}
                      <RenderTaskList date={day}/>
                    </div>
                  ))}
                </DragDropContext>
                </div>
              </div>
            </div>
          </Route>

          <Route path="/dashboard">
            <div style={{alignItems:'center', display: 'flex', flexDirection:'column', width:'100%', paddingLeft:'10px'}}>
              <Helmet>
                <title>Consult - Dashboard</title>
              </Helmet>

              <div style={{width: '100%', flexDirection:'column', overflowY: 'scroll'}}>
                <div style={{alignItems:'start', display: 'flex', flexDirection:'column', paddingLeft: '20px', width: '100%'}}>
                  <Box className={classes.taskListWindow}>
                    hi
                  </Box>
                    
                </div>
              </div>

            </div>
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
