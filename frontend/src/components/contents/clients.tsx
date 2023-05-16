import React, { FunctionComponent } from "react";
import Content from "../content";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";

// types
interface Client {
    id: number
    user: string
    phone: string
}

// main component
const Clients: FunctionComponent = () => {
    // client state
    const [clients, setClients] = React.useState<Client[]>([]);

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
            {
                clients.map(client => (
                    <div>
                        <Content key={client.user} name="client">
                            <div>{client.user}</div>
                            <div>{client.phone}</div>
                            <Management onUpdate={() => action() } type={ManagementType.switch} operation={Operation.update} command={`mutation { updateClient(id: ${client.id}, input: {isDisabled: ${true}})  {id}}`} />
                            <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteClient(id: ${client.id})  {id}}`} />
                        </Content>
                    </div>
                ))
            }
        </div>  
    );
};

export default Clients;