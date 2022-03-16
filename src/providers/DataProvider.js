import React, { useState, createContext, useEffect, useContext } from "react";
import * as firebase from "firebase";
import moment from "moment";

import { getISOWeekDates } from "../DateCalc";
import { UserContext } from "./UserProvider";

export const DataContext = createContext({ weekState: null, setWeek: null, currWeek: [], currMonth: null, taskData: [], setRefresh: null });

function DataProvider(props) {
  const user = useContext(UserContext);
  const [weekState, setWeek] = useState(moment().week());
  const [taskData, setTaskData] = useState([]);
  const [refresh, setRefresh] = useState(0);

  let ISOWeekDates = getISOWeekDates(weekState);
  let currWeek = ISOWeekDates[0];
  let currMonth = ISOWeekDates[1];

  let modWeek = [];

  useEffect(() => {

    ISOWeekDates = getISOWeekDates(weekState);
    currWeek = ISOWeekDates[0];
    currMonth = ISOWeekDates[1];

    for (const i of currWeek) {
      modWeek.push(moment(i).format("DD/MM/yyyy"));
    }
    
    async function fetchData(userToken = user.uid) {
      if(user.email != undefined) {
        const requestOptions = {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
          body: JSON.stringify({ date: modWeek, token: userToken}),
        };
        await fetch(
          "https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/get-all-tasks",
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            setTaskData(data);
          });
      }
    }
    fetchData();
      
  }, [weekState, refresh, user]);

  async function fetchMeetData(dates) {
    if(user.email != undefined) {
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
        body: JSON.stringify({ date: dates, token: user.uid}),
      };
      await fetch(
        "https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/get-meeting-tasks",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setTaskData(data);
        });
    }
  }

  async function fetchWorkData(dates) {
    if(user.email != undefined) {
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
        body: JSON.stringify({ date: dates, token: user.uid}),
      };
      await fetch(
        "https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/get-work-tasks",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setTaskData(data);
        });
    }
  }

  async function fetchCommData(dates) {
    if(user.email != undefined) {
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
        body: JSON.stringify({ date: dates, token: user.uid}),
      };
      await fetch(
        "https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/get-comm-tasks",
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setTaskData(data);
        });
    }
  }

  return (
    <DataContext.Provider value={{ weekState: weekState, setWeek: setWeek, currWeek: currWeek, currMonth: currMonth, taskData: taskData, setTaskData: setTaskData, setRefresh: setRefresh}}>
      {props.children}
    </DataContext.Provider>
  );
}

export default DataProvider;
