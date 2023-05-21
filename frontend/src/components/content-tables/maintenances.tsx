import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";

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

    // context
    const privileges = React.useContext(RoleContext);

    // maintenance schema
    const tableHeader: ITableHeader[] = [
        { key: "status", title: "Status" },
        { key: "booketAt", title: "Booked date" },
        { key: "address", title: "Address" },
        { key: "delete", title: "Delete", isControlType: true },
    ];
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
            <ContentTable name="maintenance" headers={tableHeader} canRead={privileges.readMaintenance} canWrite={privileges.writeMaintenance} data={
                maintenances.map(maintenance => ({
                    status: maintenance.status,
                    bookedAt: new Date(parseInt(maintenance.bookedAt)).toLocaleDateString(),
                    address: maintenance.address,
                    delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteMaintenance(id: ${maintenance.id})  {id}}`} />
                }))
            } />
        </div>
    );
};

export default Maintenances;