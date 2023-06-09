import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Switch, Select, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";

const initialInfo = {
    user: "",
    password: "",
    role: "PRODUCT_MANAGER",
    isDisabled: false
};

interface IAdminProps {
    id?: number
    onUpdate?: () => void
}

const Admin: FunctionComponent<IAdminProps> = ({ id, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // process form type (create or update)
    const adminCommand = id === undefined ?
        `mutation { createAdmin(input: {user: "${info.user}", password: "${info.password}" role: "${info.role}"}) {id user role}}` :
        `mutation { updateAdmin(id: ${id},input: {user: "${info.user}", role: "${info.role}", isDisabled: ${info.isDisabled}}) {id user role}}`;

    // load data function
    const action = async () => {
        if (id !== undefined) {
            const result = await getServerData(`query { admin(id: ${id}) {id user role isDisabled} }`);
            dispatch({ type: "set", key: "user", value: result.data.admin.user });
            dispatch({ type: "set", key: "role", value: result.data.admin.role });
            dispatch({ type: "set", key: "isDisabled", value: result.data.admin.isDisabled });
        } else {
            dispatch({ type: "set", key: "user", value: initialInfo.user });
            dispatch({ type: "set", key: "password", value: initialInfo.password });
            dispatch({ type: "set", key: "role", value: initialInfo.role });
        }

        if (onUpdate != null) onUpdate();
    };

    // id edit form, load data
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { admin(id: ${id}) {id user role isDisabled} }`);
            dispatch({ type: "set", key: "user", value: result.data.admin.user });
            dispatch({ type: "set", key: "role", value: result.data.admin.role });
            dispatch({ type: "set", key: "isDisabled", value: result.data.admin.isDisabled });
        };
        if (id !== undefined) action();
    }, [id]);

    // render component
    return (
        <ContentForm id={id} name="admin" title="Create new admin" command={adminCommand} commandDisabled={info.user === "" || (info.password === "" && id === undefined)} onUpdate={() => action()}>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="Admin User" value={info.user} onChange={e => dispatch({ type: "set", key: "user", value: e.target.value })} />
            </FormControl>
            {id === undefined && (
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" type="password" label="Password" value={info.password} onChange={e => dispatch({ type: "set", key: "password", value: e.target.value })} />
                </FormControl>
            )}
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" variant="outlined" label="Role" defaultValue={info.role} value={info.role} onChange={e => dispatch({ type: "set", key: "role", value: e.target.value })}>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="PRODUCT_MANAGER">Product Manager</MenuItem>
                    <MenuItem value="SALES_MAN">Sales Man</MenuItem>
                    <MenuItem value="TECHNICAL">Technical</MenuItem>
                </Select>
            </FormControl>
            {id !== undefined && (
                <FormControl fullWidth margin="normal">
                    <Switch onChange={(e) => dispatch({ type: "set", key: "isDisabled", value: e.target.checked })} checked={info.isDisabled as boolean} />
                </FormControl>
            )}
        </ContentForm>
    )
}

export default Admin;