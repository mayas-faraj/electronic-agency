import React, { FunctionComponent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Modal } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import AdminForm from "../content-forms/admin";
import AdminView from "../views/admin";
import getServerData from "../../libs/server-data";
import RoleContext from "../role-context";

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
    const action = async () => {
        const result = await getServerData(`query { admins { id user role isDisabled }}`)
        setAdmins(result.data.admins);
    };

    // event handler
    React.useEffect(() => {
        action();
    }, []);

    // render
    return (
        <div>
            <ContentTable 
            name="admin" 
            headers={tableHeader} 
            canRead={privileges.readAdmin} 
            canWrite={privileges.writeAdmin} 
            hasSnColumn={true} 
            addNewLink="/add-admin"
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