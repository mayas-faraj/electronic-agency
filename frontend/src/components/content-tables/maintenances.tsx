import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { Email, Drafts } from "@mui/icons-material";
import MaintenanceForm from "../content-forms/maintenance";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";
import getServerData from "../../libs/server-data";
import data from "../../data.json";

// types
interface Maintenance {
    id: number
    status: string
    bookedAt: string
    isRead: boolean
    productItem: {
        product?: {
            name: string
            model: string
            image: string
        }
    }
}

// main component
const Maintenances: FunctionComponent = () => {
    // maintenance state
    const [maintenances, setMaintenances] = React.useState<Maintenance[]>([]);
    const [openId, setOpenId] = React.useState(0);

    // context
    const privileges = React.useContext(RoleContext);

    // maintenance schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Product Image", isSpecialType: true },
        { key: "product", title: "Product" },
        { key: "bookedAt", title: "Booked date" },
        { key: "view", title: "Open", isSpecialType: true },
        { key: "status", title: "Status" },
        { key: "delete", title: "Delete", isControlType: true },
    ];
    // on load
    const action = async () => {
        const result = await getServerData(`query { maintenances {id status bookedAt isRead productItem { product { name model image } } } }`)
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
                    image: <img src={data["site-url"] + maintenance.productItem.product?.image} alt={maintenance.productItem.product?.name} />,
                    product: maintenance.productItem.product?.name + '\n' + maintenance.productItem.product?.model,
                    bookedAt: new Date(parseInt(maintenance.bookedAt)).toLocaleDateString(),
                    view: <Button variant="text" color="info" onClick={() => setOpenId(maintenance.id)}>{maintenance.isRead ? <Drafts /> : <Email />}</Button>,
                    status: maintenance.status,
                    delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteMaintenance(id: ${maintenance.id})  {id}}`} />
                }))
            } />
            <Modal open={openId !== 0} onClose={() => setOpenId(0)} >
                <div className="modal">
                    <MaintenanceForm id={openId} onUpdate={action}/>
                </div>
            </Modal>
        </div>
    );
};

export default Maintenances;