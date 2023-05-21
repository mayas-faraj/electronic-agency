import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";

// types
interface Admin {
    id: number
    user: string
    role: string
    isDisabled: boolean
}

// main component
const Admins: FunctionComponent = () => {
    // admin state
    const [admins, setAdmins] = React.useState<Admin[]>([]);
    
    // context
    const privileges = React.useContext(RoleContext);
    
    // admin schema
    const tableHeader: ITableHeader[] = [
        { key: "user", title: "User Name"},
        { key: "role", title: "Role"},
        { key: "isDisabled", title: "Disable", isControlType: true},
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
                    isDisabled: <Management type={ManagementType.switch} operation={Operation.update} command={`mutation { updateAdmin(id: ${admin.id}, input: {isDisabled: ${!admin.isDisabled}})  {id}}`} initialValue={admin.isDisabled} onUpdate={() => action()} />,
                    delete: <Management type={ManagementType.button} operation={Operation.delete} command={`mutation { deleteAdmin(id: ${admin.id})  {id}}`} hasConfirmModal={true} onUpdate={() => action()} />
                }))
            } />
        </div>
    );
};

export default Admins;