import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Switch, TextField } from "@mui/material";
import { Select } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";

const Admin: FunctionComponent<{ id?: number }> = ({ id }) => {
    // component reducer
    const initialInfo = {
        id: 0,
        user: "",
        password: "",
        role: "PRODUCT_MANAGER",
        isDisabled: false
    };

    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // process form type (create or update)
    const isUpdate = id !== undefined;
    const adminCommand = !isUpdate ?
        `mutation { createAdmin(input: {user: "${info.user}", password: "${info.password}" role: "${info.role}"}) {id user role}}` :
        `mutation { updateAdmin(id: ${id},input: {user: "${info.user}", role: "${info.role}", isDisabled: "${info.isDisabled}"}) {id user role}}`;

    // load data function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const action = async () => {
        if (isUpdate) {
            const result = await getServerData(`query { admin(id: ${id}) {id user role isDisabled} }`);
            dispatch({ type: "set", key: "user", value: result.data.admin.user });
            dispatch({ type: "set", key: "role", value: result.data.admin.user });
            dispatch({ type: "set", key: "isDisabled", value: result.data.admin.user });
        } else {
            dispatch({ type: "set", key: "user", value: initialInfo.user });
            dispatch({ type: "set", key: "password", value: initialInfo.password });
            dispatch({ type: "set", key: "role", value: initialInfo.role });
        }
    };

    // id edit form, load data
    React.useEffect(() => {
        if (isUpdate) action();
    }, [action, isUpdate]);

    // render component
    return (
        <ContentForm name="admin" title="Create new admin" command={adminCommand} onUpdate={() => action()}>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="Admin User" value={info.user} onChange={e => dispatch({ type: "set", key: "user", value: e.target.value })} />
            </FormControl>
            {!isUpdate && (
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" type="password" label="Password" value={info.password} onChange={e => dispatch({ type: "set", key: "password", value: e.target.value })} />
                </FormControl>
            )}
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" variant="outlined" aria-label="role" label="Role" defaultValue={info.role} value={info.role} onChange={e => dispatch({ type: "set", key: "role", value: e.target.value })}>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="PRODUCT_MANAGER">Product Manager</MenuItem>
                    <MenuItem value="SALES_MAN">Sales Man</MenuItem>
                    <MenuItem value="TECHNICAL">Technical</MenuItem>
                </Select>
            </FormControl>
            {isUpdate && (
                <FormControl fullWidth margin="normal">
                    <Switch onChange={(e) => dispatch({ type: "set", key: "isDisabled", value: e.target.checked})} value={info.isDisabled} />
                </FormControl>
            )}
        </ContentForm>
    )
}

export default Admin;