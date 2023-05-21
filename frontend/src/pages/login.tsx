import React, { FunctionComponent } from "react";
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
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
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
      setErrorMessage("Please fill-in the user and password");
      return;
    }

    // verification of user
    setLoading(true);
    const action = async () => {
      const loginResult = await getServerData(`query { verifyAdmin(user: "${user}", password: "${password}") { jwt success message } }`);

      setUser("");
      setPassword("");

      if (loginResult.errors != null) {
        if (loginResult.errors.length > 0 && loginResult.errors[0].message != null) setErrorMessage(loginResult.errors[0].message);
        else setErrorMessage("Error while trying to login operation.");
      } else {
        const result = loginResult.data?.verifyAdmin;
        if (result != null) {
          if (result.success && result.jwt !== "") {
            setSuccessMessage(result.message);

            // save access token
            StorageManager.save(result.jwt);

            // navigate to home
            setTimeout(() => { window.location.href="/alardh-alsalba"; }, 1000);
          } else setErrorMessage(result.message);
        } else setErrorMessage("Unknown error");
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
      <Snackbar open={successMessage !== ""} onClose={() => { setSuccessMessage("") }} autoHideDuration={6000}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={errorMessage !== ""} onClose={() => { setErrorMessage("") }} autoHideDuration={6000}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
