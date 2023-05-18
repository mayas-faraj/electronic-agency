import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { CellDataTransform, ITableHeader } from "../content-table";

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

    // admin schema
    const tableHeader: ITableHeader[] = [
        { key: "user", title: "User Name"},
        { key: "role", title: "Role"},
        { key: "isDisabled", title: "Disable", dataTransform: CellDataTransform.switch},
        { key: "delete", title: "Delete", dataTransform: CellDataTransform.button},
    ];
   
    // on load
    const action = async () => {
        const result = await getServerData(`query { admins { id user role isDisabled }}`)
        setAdmins(result.data.admins);
    };

    // event handler
    React.useEffect(() => {
        action();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // render
    return (
        <div>
            <ContentTable name="admin" headers={tableHeader} data={
                admins.map(admin => ({
                    ...admin,
                    isDisabled: <Management onUpdate={() => action()} type={ManagementType.switch} operation={Operation.update} command={`mutation { updateAdmin(id: ${admin.id}, input: {isDisabled: ${true}})  {id}}`} />,
                    delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteAdmin(id: ${admin.id})  {id}}`} />
                }))
            } />
        </div>
    );
};

export default Admins;