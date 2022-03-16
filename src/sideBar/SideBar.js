import React, { useContext } from 'react';
import {
    NavLink,
    useLocation
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {UserContext} from '../providers/UserProvider';
import * as firebase from 'firebase';


const useStyles = makeStyles((theme) => ({
  iconButton: {
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
  },
  button: {
    display: 'flex',
    padding: '10px',
    width: '100%',
    borderRadius: 0,
    border: 0,
    fontFamily: 'Poppins',
    fontSize: '1em',
    fontWeight: '500',
    textTransform: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    transition: 'border 0.2s',
    "&:hover":{
        borderRadius: 0,
        borderLeft: '6px solid #E3B04B',
        backgroundColor: '#1f1f1f',
        color: '#E3B04B',
    },
    "&.Mui-selected": {
        backgroundColor: 'transparent',
        color: '#E3B04B'
    },
  },
  sideBar: {
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'top',
    width: '15em',
    height: '-webkit-fill-available',
    backgroundColor: '#2b2b2b',
    borderRadius: '30px',
    textAlign: 'center',
    margin: '0.8em',
  },
  userMenuButton: {
    margin: '20px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  selectedToggle: {
      color: 'red',
    "&.Mui-selected": {
        backgroundColor: 'transparent',
        color: '#E3B04B'
    }
  },
}));

export function SideBar() {
    const classes = useStyles();

    const user = useContext(UserContext);
    const {firstName, lastName} = user;

    const [invisible, setInvisible] = React.useState(false);
  
    const handleBadgeVisibility = () => {
        setInvisible(!invisible);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const location = useLocation(); // Gets the current url path
    const [view, setView] = React.useState(location.pathname);

    const handleViewChange = (event, nextView) => {
        if (nextView !== null) {
            setView(nextView);
        }
    };

    return (
        <Box className={classes.sideBar}>
            <Avatar alt={firstName + " " + lastName} src="/static/images/avatar/1.jpg" style={{alignSelf: 'center', margin: '15px auto', width: '50px', height: '50px'}} />

            {!user.email ? 
                <span  className={classes.userMenuButton}>
                    <CircularProgress size={25} thickness={5}/>
                </span> 
                :
                <span onClick={handleClick} className={classes.userMenuButton}>
                    <h3 style={{fontFamily:'Poppins', fontSize:'16px', fontWeight:'500', color: 'rgba(255, 255, 255, 0.9)'}} >{firstName + " " + lastName}</h3>
                    <ExpandMoreIcon style={{marginLeft: '5px', color: 'white'}}/>
                </span>
            }

            <Badge color="secondary" variant="dot" color="primary" className={classes.iconButton} onClick={handleBadgeVisibility} invisible={invisible}>
                <NotificationsIcon style={{ fontSize: '30px' }}/>
            </Badge>
            
            <ToggleButtonGroup orientation="vertical" style={{width:'100%', marginTop:'20px'}} value={view} exclusive onChange={handleViewChange}>
                    <ToggleButton value="/dashboard" style={{border:0, padding:0}}>
                        <NavLink to="/dashboard" style={{display:'flex', width:'100%',textDecoration: 'none',}}>
                            <div className={classes.button}>
                                <DashboardIcon style={{padding: '10px'}}/>
                                Nástenka
                            </div>
                        </NavLink> 
                    </ToggleButton>
                
                    <ToggleButton value="/" style={{border:0, padding:0}} >
                        <NavLink to="/" style={{display:'flex', width:'100%',textDecoration: 'none',}}>
                            <div className={classes.button}>
                                <CalendarTodayIcon style={{padding: '10px'}}/>
                                Týždenné
                            </div>
                        </NavLink>
                    </ToggleButton>
            </ToggleButtonGroup>

            <Menu
                classes={{ root: classes.taskSelect }}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                getContentAnchorEl={null}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} style={{fontFamily:'Poppins'}} >Nastavenia</MenuItem>
                <MenuItem onClick={() => {firebase.auth().signOut()}} style={{fontFamily:'Poppins'}}>Odhlásit sa</MenuItem>
            </Menu>
        </Box>
    );
  }