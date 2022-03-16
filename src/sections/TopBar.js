import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { DataContext } from "../providers/DataProvider";
import { MeetAddTaskDialog } from '../dialogWindows/addTaskDialogs/MeetAddTaskDialog';
import { WorkAddTaskDialog } from '../dialogWindows/addTaskDialogs/WorkAddTaskDialog';
import { CommAddTaskDialog } from '../dialogWindows/addTaskDialogs/CommAddTaskDialog';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  monthTitle: {
    fontFamily: 'Poppins',
    color: '#2b2b2b',
    fontWeight: '500',
    fontSize: '1.4em',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    textTransform: 'capitalize',
    padding: '0px 30px'
  },
  taskTypeTitle: {
    fontFamily: 'Poppins',
    fontSize: '1.3em',
    fontWeight: '600',
  },
  chevronButtons: {
    cursor: 'pointer',
    fontSize: '2em',
    fontWeight: '500',
    color: 'rgba(43,43,43,0.7)',
  },
}))

export function TopBar() {
  const classes = useStyles();
  const { weekState, setWeek, currWeek, currMonth, taskData, setRefresh } = useContext(DataContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const [openMeetDialog, setOpenMeetDialog] = React.useState(false);
  const [openWorkDialog, setOpenWorkDialog] = React.useState(false);
  const [openCommDialog, setOpenCommDialog] = React.useState(false);

  const handleDialogClose = () => {
    setOpenMeetDialog(false);
    setOpenWorkDialog(false);
    setOpenCommDialog(false);
  }

  const findCurrDate = () => {
    setWeek(moment().week());

    setTimeout(() => {
      let currDate = moment().startOf('day').valueOf();
      document.getElementById(currDate).scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });
    }, 1000);
  };

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        margin: "1em 0px",
        alignContent: "center",
        width: "95%",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Previous week">
            <ChevronLeftIcon
              className={classes.chevronButtons}
              onClick={() => setWeek(parseInt(weekState) - 1)}
            />
          </Tooltip>

          <Button
            onClick={() => {
              findCurrDate();
            }}
            style={{
              margin: "0px 5px",
              color: "rgba(43,43,43,1)",
              fontFamily: "Poppins",
              fontSize: "0.9em",
              fontWeight: "600",
              border: "solid 1px lightgray",
            }}
          >
            DNES
          </Button>
          <Tooltip title="Next week">
            <ChevronRightIcon
              className={classes.chevronButtons}
              onClick={() => setWeek(parseInt(weekState) + 1)}
            />
          </Tooltip>
        </div>

        <h2 className={classes.monthTitle}>{currMonth}</h2>
      </div>

      <Button
        onClick={handleClick}
        style={{
          marginRight: "2em",
          color: "rgba(43,43,43,1)",
          fontFamily: "Poppins",
          fontSize: "0.9em",
          fontWeight: "600",
          border: "solid 1px lightgray",
          float: "right",
        }}
      >
        PRIDAŤ
      </Button>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {setOpenMeetDialog(true); handleClose()}} style={{ fontFamily: "Poppins" }}>
          Stretnutie
        </MenuItem>
        <MenuItem onClick={() => {setOpenWorkDialog(true); handleClose()}} style={{ fontFamily: "Poppins" }}>
          Práca
        </MenuItem>
        <MenuItem onClick={() => {setOpenCommDialog(true); handleClose()}} style={{ fontFamily: "Poppins" }}>
          Komunikácia
        </MenuItem>
      </Menu>
      <MeetAddTaskDialog onClose={handleDialogClose} open={openMeetDialog} />
      <WorkAddTaskDialog onClose={handleDialogClose} open={openWorkDialog} />
      <CommAddTaskDialog onClose={handleDialogClose} open={openCommDialog}/>
    </div>
  );
}
