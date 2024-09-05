import React, { FunctionComponent } from "react";
import { FormControl, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";

const initialInfo = {
  password: "",
  confirmPassword: "",
};

interface IAdminProps {
  id?: number;
  onUpdate?: () => void
}

const Password: FunctionComponent<IAdminProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  const onFormUpdate = () => {
    if (onUpdate !== undefined) onUpdate();
    dispatch({type: "set", key: "password", value: ""});
    dispatch({type: "set", key: "confirmPassword", value: ""});
  };

  // process form type (create or update)
  const adminCommand =
    id !== undefined
      ? `mutation { updateUser(id: ${id},input: {password: "${info.password}"}) {id user }}`
      : `mutation { updateAdminByAuth(input: {password: "${info.password}"}) {id user }}`;

  // render component
  return (
    <ContentForm
      id={id}
      name="admin"
      command={adminCommand}
      onUpdate={onFormUpdate}
      commandDisabled={
        info.password === "" || info.password !== info.confirmPassword
      }
    >
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          type="password"
          label="Password"
          value={info.password}
          onChange={(e) =>
            dispatch({ type: "set", key: "password", value: e.target.value })
          }
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          type="password"
          label="Password"
          value={info.confirmPassword}
          onChange={(e) =>
            dispatch({
              type: "set",
              key: "confirmPassword",
              value: e.target.value,
            })
          }
        />
      </FormControl>
    </ContentForm>
  );
};

export default Password;
