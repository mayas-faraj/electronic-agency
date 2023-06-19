import React, { FunctionComponent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Button, InputAdornment, Modal, TextField } from "@mui/material";
import { Search, Visibility } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import AdminForm from "../content-forms/admin";
import AdminView from "../views/admin";
import RoleContext from "../role-context";
import getServerData from "../../libs/server-data";

// types
interface IAdmin {
    id: number
    user: string
    role: string
    isDisabled: boolean
}

// main component
const Admins: FunctionComponent = () => {
    // admin state
    const [admins, setAdmins] = React.useState<IAdmin[]>([]);
    const [editId, setEditId] = React.useState(0);
    const [viewId, setViewId] = React.useState(0);
    const [keyword, setKeyword] = React.useState("");
    
    // context
    const privileges = React.useContext(RoleContext);
    
    // admin schema
    const tableHeader: ITableHeader[] = [
        { key: "user", title: "User Name"},
        { key: "role", title: "Role"},
        { key: "isDisabled", title: "Disable", isControlType: true},
        { key: "view", title: "More Info", isSpecialType: true},
        { key: "edit", title: "Edit", isControlType: true},
        { key: "delete", title: "Delete", isControlType: true},
    ];
   
    // on load
    const action = React.useCallback(async () => {
        const result = await getServerData(`query { admins(filter: {keyword: "${keyword}"}) { id user role isDisabled }}`)
        setAdmins(result.data.admins);
    }, [keyword]);

    // event handler
    React.useEffect(() => {
        action();
    }, [action]);

    // render
    return (
        <div>
            <TextField
              label="Search"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value) }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <ContentTable 
            name="admin" 
            headers={tableHeader} 
            canRead={privileges.readAdmin} 
            canWrite={privileges.writeAdmin} 
            hasSnColumn={true} 
            addNewLink="/add-admin"
            isAddNewRight={true}
            data={
                admins.map(admin => ({
                    user: admin.user,
                    role: admin.role.toLowerCase().replace("_", " "),
                    isDisabled: <Management type={ManagementType.switch} operation={Operation.update} command={`mutation { updateAdmin(id: ${admin.id}, input: {isDisabled: ${!admin.isDisabled}})  {id}}`} initialValue={admin.isDisabled} onUpdate={action} />,
                    view: <Button variant="text" color="info" onClick={() => setViewId(admin.id)}><Visibility /></Button>,
                    edit: <Button variant="text" color="success" onClick={() => setEditId(admin.id)}><EditIcon /></Button>,
                    delete: <Management type={ManagementType.button} operation={Operation.delete} command={`mutation { deleteAdmin(id: ${admin.id})  {id}}`} hasConfirmModal={true} onUpdate={action} />
                }))
            } />
            <Modal open={editId !== 0} onClose={() => setEditId(0)} >
                <div className="modal">
                    <AdminForm id={editId} onUpdate={() => action()} />
                </div>
            </Modal>
            <Modal open={viewId !== 0} onClose={() => setViewId(0)} >
                <div className="modal">
                    <AdminView id={viewId} />
                </div>
            </Modal>
        </div>
    );
};

export default Admins;