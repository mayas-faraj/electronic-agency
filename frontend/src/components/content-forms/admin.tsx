import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Switch, Select, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import { getRoleName } from "../../libs/role-adaper";

const initialInfo = {
  user: "",
  password: "",
  role: "ADMIN",
  level: 1,
  centerId: 0,
  isDisabled: false
};

interface IAdminProps {
  id?: number;
  onUpdate?: () => void;
}

type Center = {
  id: number;
  name: string;
};

const roles = ["ADMIN", "PRODUCT_MANAGER", "SALES_MAN", "TECHNICAL"];

const Admin: FunctionComponent<IAdminProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // component state
  const [centers, setCenters] = React.useState<Center[]>([]);

  // process form type (create or update)
  const adminCommand =
    id === undefined
      ? `mutation { createAdmin(input: {user: "${info.user}", password: "${info.password}" role: "${info.role}"${
          info.role !== "ADMIN" ? `, level: ${info.level}, centerId: ${info.centerId}` : ""
        }}) {id user role}}`
      : `mutation { updateAdmin(id: ${id},input: {user: "${info.user}", role: "${info.role}"${
          info.role !== "ADMIN" ? `, level: ${info.level}, centerId: ${info.centerId}` : ""
        }, isDisabled: ${info.isDisabled}}) {id user role}}`;

  // load data function
  const action = async () => {
    if (id !== undefined) {
      const result = await getServerData(`query { admin(id: ${id}) {id user role level centerId isDisabled} }`);
      dispatch({ type: "set", key: "user", value: result.data.admin.user });
      dispatch({ type: "set", key: "role", value: result.data.admin.role });
      dispatch({ type: "set", key: "level", value: result.data.admin.level });
      dispatch({ type: "set", key: "centerId", value: result.data.admin.centerId });
      dispatch({ type: "set", key: "isDisabled", value: result.data.admin.isDisabled });
    } else {
      dispatch({ type: "set", key: "user", value: initialInfo.user });
      dispatch({ type: "set", key: "password", value: initialInfo.password });
      dispatch({ type: "set", key: "role", value: initialInfo.role });
      dispatch({ type: "set", key: "level", value: initialInfo.level });
      dispatch({ type: "set", key: "centerId", value: initialInfo.centerId });
    }

    if (onUpdate != null) onUpdate();
  };

  // id edit form, load data
  React.useEffect(() => {
    const action = async () => {
      const result = await getServerData(`query { admin(id: ${id}) {id user role level centerId isDisabled} }`);
      dispatch({ type: "set", key: "user", value: result.data.admin.user });
      dispatch({ type: "set", key: "role", value: result.data.admin.role });
      dispatch({ type: "set", key: "level", value: result.data.admin.level });
      dispatch({ type: "set", key: "centerId", value: result.data.admin.centerId });
      dispatch({ type: "set", key: "isDisabled", value: result.data.admin.isDisabled });
    };
    if (id !== undefined) action();
  }, [id]);

  React.useEffect(() => {
    const action = async () => {
      const centersResponse = await getServerData(`query { centers { id name admins { user } } }`);
      setCenters(centersResponse.data.centers);
    };
    action();
  }, []);

  // render component
  return (
    <ContentForm
      id={id}
      name="admin"
      title="Create new admin"
      command={adminCommand}
      commandDisabled={info.user === "" || (info.password === "" && id === undefined)}
      onUpdate={() => action()}
    >
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Admin User"
          value={info.user}
          onChange={(e) => dispatch({ type: "set", key: "user", value: e.target.value })}
        />
      </FormControl>
      {id === undefined && (
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            type="password"
            label="Password"
            value={info.password}
            onChange={(e) => dispatch({ type: "set", key: "password", value: e.target.value })}
          />
        </FormControl>
      )}
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          variant="outlined"
          label="Role"
          defaultValue={info.role}
          value={info.role}
          onChange={(e) => dispatch({ type: "set", key: "role", value: e.target.value })}
        >
          {roles.map((role) => (
            <MenuItem value={role}>{getRoleName(role).replace("_", " ").toLowerCase()}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {false && (
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            label="User level"
            value={info.level}
            type="number"
            inputProps={{ min: 0 }}
            onChange={(e) => dispatch({ type: "set", key: "level", value: e.target.value })}
          />
        </FormControl>
      )}
      {info.role !== "ADMIN" && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="center-label">Center</InputLabel>
          <Select
            labelId="center-label"
            variant="outlined"
            label="Center"
            defaultValue={info.centerId}
            value={info.centerId}
            onChange={(e) => dispatch({ type: "set", key: "centerId", value: e.target.value })}
          >
            <MenuItem value="0">[Top Center]</MenuItem>
            {centers.map((center) => (
              <MenuItem key={center.id} value={center.id}>
                {center.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {id !== undefined && (
        <FormControl fullWidth margin="normal">
          <Switch onChange={(e) => dispatch({ type: "set", key: "isDisabled", value: e.target.checked })} checked={info.isDisabled as boolean} />
        </FormControl>
      )}
    </ContentForm>
  );
};

export default Admin;
