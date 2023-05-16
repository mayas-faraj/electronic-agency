import React, { FunctionComponent } from "react";
import Content from "../content";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";

// types
interface Maintenance {
    id: number
    address: string
    status: string
    bookedAt: string
    propertyType: string
}

// main component
const Maintenances: FunctionComponent = () => {
    // maintenance state
    const [maintenances, setMaintenances] = React.useState<Maintenance[]>([]);

    // on load
    const action = async () => {
        const result = await getServerData(`query { maintenances {id address status bookedAt propertyType }}`)
        setMaintenances(result.data.maintenances);
    };

    React.useEffect(() => {   
        action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // render
    return (
        <div>
            {
                maintenances.map(maintenance => (
                    <div>
                        <Content key={maintenance.id} name="maintenance">
                            <div>{maintenance.status}</div>
                            <div>{maintenance.propertyType}</div>
                            <div>{maintenance.status}</div>
                            <div>{new Date(parseInt(maintenance.bookedAt)).toLocaleDateString()}</div>
                            <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteMaintenance(id: ${maintenance.id})  {id}}`} />
                        </Content>
                    </div>
                ))
            }
        </div>  
    );
};

export default Maintenances;