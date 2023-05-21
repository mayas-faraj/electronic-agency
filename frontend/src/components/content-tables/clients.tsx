import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";

// types
interface Client {
    id: number
    user: string
    phone: string
    isDisabled: boolean
}

// main component
const Clients: FunctionComponent = () => {
    // client state
    const [clients, setClients] = React.useState<Client[]>([]);

    // context
    const privileges = React.useContext(RoleContext);

    // clients schema
    const tableHeader: ITableHeader[] = [
        { key: "user", title: "User Name"},
        { key: "phone", title: "Phone"},
        { key: "isDisabled", title: "Disable", isControlType: true},
        { key: "delete", title: "Delete", isControlType: true},
    ];

    // on load
    const action = async () => {
        const result = await getServerData(`query { clients { id user phone email firstName lastName namePrefix birthDate isMale }}`)
        setClients(result.data.clients);
    };

    React.useEffect(() => {   
        action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // render
    return (
        <div>
            <ContentTable name="client" headers={tableHeader} canRead={privileges.readClient} canWrite={privileges.writeClient} data={
                clients.map(client => ({
                    ...client,
                    isDisabled: <Management onUpdate={() => action() } type={ManagementType.switch} operation={Operation.update} command={`mutation { updateClient(id: ${client.id}, input: {isDisabled: ${true}})  {id}}`} />,
                    delete: <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteClient(id: ${client.id})  {id}}`} />
                }))
            } />
        </div>  
    );
};

export default Clients;