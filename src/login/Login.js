import React, { useState, useContext } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../index';
import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    },
})(TextField);

export const useStyles = makeStyles((theme) => ({
    loginPage: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '15%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '6em 8em',
        background: '#FAFAFA',
        borderRadius: '20px',
        boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.05)',
    },
    inputBox: {
        margin: '10px',
        "& input::placeholder": {
            fontFamily: 'Poppins',
            color: 'red',
        },
        "& input": {
            fontFamily: 'Poppins',
        }
    },
    loginButton: {
        margin: '20px',
        fontFamily: 'Poppins',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
        background: '#E3B04B',
        '&:hover': {
            background: '#ffc44f',
        }
    }
}))

function Login() {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setErrors] = useState("");

    const Auth = useContext(AuthContext);
    
    const handleForm = e => {
        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                if (res.user) Auth.setLoggedIn(true);
            })
            .catch(e => {
                setErrors(e.message);
            });
    };

    return (
        <div style={{height:"100%", width:"100%", background:"#ECECEC"}}>
            <Helmet>
                <title>Consult App - Login</title>
            </Helmet>
            <form onSubmit={e => handleForm(e)} className={classes.loginPage}>
                <h1 style={{fontFamily:"Poppins", textAlign:"center", fontWeight:"600"}}>
                    Log in
                </h1>
                <TextField label="Email" value={email} variant="outlined" onChange={e => setEmail(e.target.value)} className={classes.inputBox} InputProps={{classes: {input: classes.inputBoxText,},}}/>
                <TextField label="Password" value={password} type="password" variant="outlined" onChange={e => setPassword(e.target.value)} className={classes.inputBox}/>

                <Button type="submit" className={classes.loginButton}>
                    Continue
                </Button>

                <span>{error}</span>
            </form>
        </div>
    );
}

export default Login;