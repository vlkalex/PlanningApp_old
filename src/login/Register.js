import React, { useState, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../index';
import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import '../App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const useStyles = makeStyles((theme) => ({
    registerPage: {
        height: '100%',
        width: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },

}))

function Register() {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setErrors] = useState("");

    const Auth = useContext(AuthContext);
    
    const handleForm = e => {
        e.preventDefault();
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(res => {
            if (res.user) Auth.setLoggedIn(true);
        })
        .catch(e => {
            setErrors(e.message);
        });
    };

    return (
        <div >
            <form onSubmit={e => handleForm(e)} className={classes.registerPage}>
                <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)}/>

                <Button type="submit">
                    Register
                </Button>

                <span>{error}</span>
            </form>
        </div>
    );
}

export default Register;