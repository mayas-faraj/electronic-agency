import React, { FunctionComponent } from "react";
import Content from "../content";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";

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

    // on load
    const action = async () => {
        const result = await getServerData(`query { admins { id user role isDisabled }}`)
        setAdmins(result.data.admins);
    };

    React.useEffect(() => {   
        action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // render
    return (
        <div>
            {
                admins.map(admin => (
                    <div>
                        <Content key={admin.user} name="admin">
                            <div>{admin.user}</div>
                            <div>{admin.role}</div>
                            <Management onUpdate={() => action() } type={ManagementType.switch} operation={Operation.update} command={`mutation { updateAdmin(id: ${admin.id}, input: {isDisabled: ${true}})  {id}}`} />
                            <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteAdmin(id: ${admin.id})  {id}}`} />
                        </Content>
                    </div>
                ))
            }
        </div>  
    );
};

export default Admins;