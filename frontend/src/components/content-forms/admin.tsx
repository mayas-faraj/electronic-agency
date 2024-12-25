import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Switch, Select, TextField, OutlinedInput, Box, Chip } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";

const initialInfo = {
  user: "",
  password: "",
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

type AdminType = {
  id: number;
  user: string;
  userRoles: {
    role: {
      name: string;
    };
  }[];
};

const availableRoles = ["admin", "data_viewer", "sales_man", "offer_admin", "top_call_center", "call_center", "contractor_manager", "technician", "closer", "feedback"];

const Admin: FunctionComponent<IAdminProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // component state
  const [centers, setCenters] = React.useState<Center[]>([]);
  const [roles, setRoles] = React.useState<string[]>([]);

  // process form type (create or update)
  const adminCommand =
    id === undefined
      ? `mutation { createUser(input: {user: "${info.user}", password: "${info.password}" roles: [${roles.map((role) => `"${role}"`).join(",")}]${
          !roles.includes("admin") ? `, level: ${info.level}, centerId: ${info.centerId !== 0 ? info.centerId : null}` : ""
        }}) {id user}}`
      : `mutation { updateUser(id: ${id},input: {user: "${info.user}", roles: [${roles.map((role) => `"${role}"`).join(",")}]${
          !roles.includes("admin") ? `, level: ${info.level}, centerId: ${info.centerId}` : ""
        }, isDisabled: ${info.isDisabled}}) {id user}}`;

  // load data function
  const action = async () => {
    if (id !== undefined) {
      const result = await getServerData(`query { user(id: ${id}) {id user userRoles { role { name } } level centerId isDisabled} }`);
      dispatch({ type: "set", key: "user", value: result.data.user.user });
      dispatch({ type: "set", key: "level", value: result.data.user.level });
      dispatch({ type: "set", key: "centerId", value: result.data.user.centerId });
      dispatch({ type: "set", key: "isDisabled", value: result.data.user.isDisabled });
      setRoles((result.data.user as AdminType).userRoles.map((userRole) => userRole.role.name));
    } else {
      dispatch({ type: "set", key: "user", value: initialInfo.user });
      dispatch({ type: "set", key: "password", value: initialInfo.password });
      dispatch({ type: "set", key: "level", value: initialInfo.level });
      dispatch({ type: "set", key: "centerId", value: initialInfo.centerId });
      setRoles([]);
    }

    if (onUpdate != null) onUpdate();
  };

  // id edit form, load data
  React.useEffect(() => {
    const action = async () => {
      const result = await getServerData(`query { user(id: ${id}) {id user userRoles { role { name } } level centerId isDisabled} }`);
      dispatch({ type: "set", key: "user", value: result.data.user.user });
      dispatch({ type: "set", key: "level", value: result.data.user.level });
      dispatch({ type: "set", key: "centerId", value: result.data.user.centerId });
      dispatch({ type: "set", key: "isDisabled", value: result.data.user.isDisabled });
      setRoles((result.data.user as AdminType).userRoles.map((userRole) => userRole.role.name));
    };
    if (id !== undefined) action();
  }, [id]);

  React.useEffect(() => {
    const action = async () => {
      const centersResponse = await getServerData(`query { centers { id name users { user } } }`);
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
      commandDisabled={info.user === "" || (info.password === "" && id === undefined) || roles.length === 0}
      onUpdate={() => action()}
    >
      <FormControl fullWidth margin="normal">
        <TextField variant="outlined" label="Admin User" value={info.user} onChange={(e) => dispatch({ type: "set", key: "user", value: e.target.value })} />
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
          defaultValue={roles}
          value={roles}
          multiple={true}
          onChange={(e) => (Array.isArray(e.target.value) ? setRoles(e.target.value) : setRoles([e.target.value]))}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {availableRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {role.replace("_", " ").toLowerCase()}
            </MenuItem>
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
      {!roles.includes("admin") && (
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
