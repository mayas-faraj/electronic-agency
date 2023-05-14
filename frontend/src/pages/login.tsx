import React, { FunctionComponent } from "react";
import { useNavigate } from 'react-router-dom';
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { Snackbar, Alert } from "@mui/material";
import getServerData from "../libs/server-data";
import MainCover from "../components/main-cover";
import styles from "../styles/login.module.scss";
import StorageManager from "../libs/storage-manager";

const LoginPage: FunctionComponent = () => {
  // components state
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [successMessage, setsuccessMessage] = React.useState("");
  const [errorMessage, setErrrorMessage] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  // on load clear localstorage
  React.useEffect(() => {
    StorageManager.clear();
  }, []);

  // component event handler
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // precondition
    if (user === "" || password === "") {
      setErrrorMessage("Please fill-in the user and password");
      return;
    }

    // verification of user
    setLoading(true);
    const action = async () => {
      const loginResult = await getServerData(`query { verifyAdmin(user: "${user}", password: "${password}") { jwt id user role } }`);

      setUser("");
      setPassword("");

      if (loginResult.errors != null) {
        if (loginResult.errors.length > 0 && loginResult.errors[0].message != null) setErrrorMessage(loginResult.errors[0].message);
        else setErrrorMessage("Error while trying to login operation.");
      } else {
        const jwt = loginResult.data?.verifyAdmin?.jwt;
        if (jwt != null && jwt !== "") {
          setsuccessMessage("Login Success");

          // save access token
          StorageManager.save(jwt);

          // navigate to home
          setTimeout(() => { window.location.href="/"; }, 1000);
        } else setErrrorMessage("User and/or password error!");
      }
    };
    await action();
    setLoading(false);
  };

  // render
  return (
    <div className={styles.wrapper}>
      <MainCover />
      <div className={styles.form__wrapper}>
        <div className={styles.form__container}>
          <h1 className={styles.heading}>Sign in</h1>
          <form className={styles.form}>
            <TextField
              id="userText"
              label="User"
              value={user}
              onChange={(e) => { setUser(e.target.value) }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="passwordText"
              label="Password"
              value={password}
              type="password"
              onChange={(e) => { setPassword(e.target.value) }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <button disabled={isLoading} className="button" onClick={e => { handleClick(e) }}>Sign in {isLoading ? <HourglassBottomIcon className={styles.loading__icon} /> : undefined}</button>
          </form>
        </div>
      </div>
      <Snackbar open={successMessage !== ""} onClose={() => { setsuccessMessage("") }} autoHideDuration={6000}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={errorMessage !== ""} onClose={() => { setErrrorMessage("") }} autoHideDuration={6000}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
