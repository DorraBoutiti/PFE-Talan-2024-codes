import React from 'react';
import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import * as api from "../../../services/authentification.service";
import styles from "./styles.module.css";
import axios from "axios";
import { Divider, Grid } from '@mui/material';


const PasswordReset = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const param = useParams();

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await api.verify_password_reset_link(param.id, param.token);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [param]);

  const handleSubmit = async (e) => {
    console.log("1");
    e.preventDefault();
    console.log("12");
    try {
      //const data = api.setNewPassword(param.id, param.token, password);    
      const url = `http://localhost:5000/reset/${param.id}/${param.token}`;
      const { data } = await axios.post(url, { password });
      setMsg(data.message);
      setError("");
      window.location = "/talan-hr/pages/login/login3";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
      }
    }
  };

  return (
    <Fragment>
      {validUrl ? (
        <div className={styles.container}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Create New Password</h2>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button type="submit" className={styles.green_btn}>
              Submit
            </button>
          </form>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </Fragment>

  );
};

export default PasswordReset;
