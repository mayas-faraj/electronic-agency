import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { Email, Drafts } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import OrderForm from "../content-forms/order";
import getServerData from "../../libs/server-data";
import RoleContext from "../role-context";
import data from "../../data.json";

// types
interface Order {
    id: number
    count: string
    totalPrice: string
    status: string
    createdAt: Date
    isOfferRequest: boolean
    isRead: boolean
    product?: {
        name: string
        model: string
        image: string
    }
}

// main component
const Orders: FunctionComponent = () => {
    // order state
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [openId, setOpenId] = React.useState(0);

    // context
    const privileges = React.useContext(RoleContext);

    // order schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Product Image", isSpecialType: true },
        { key: "product", title: "Product" },
        { key: "count", title: "Count" },
        { key: "totalPrice", title: "Total price" },
        { key: "view", title: "Open", isSpecialType: true },
        { key: "status", title: "Status" },
        { key: "delete", title: "Delete", isControlType: true },
    ];

    // on load
    const action = async () => {
        const result = await getServerData(`query { orders { id count totalPrice isOfferRequest isRead status createdAt product{name image model}}}`)
        setOrders(result.data.orders);
    };


    React.useEffect(() => {
        action();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // render
    return (
        <div>
            <ContentTable name="order" headers={tableHeader} canRead={privileges.readOrder} canWrite={privileges.writeOrder} data={
                orders.map(order => ({
                    image: <img src={data["site-url"] + order.product?.image} alt={order.product?.name} />,
                    product: order.product?.name + '\n' + order.product?.model,
                    count: order.count,
                    totalPrice: order.isOfferRequest ? <span></span> : order.totalPrice,
                    view: <Button variant="text" color="info" onClick={() => setOpenId(order.id)}>{order.isRead ? <Drafts /> : <Email />}</Button>,
                    status: order.status,
                    delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteOrder(id: ${order.id})  {id}}`} />
                }))
            } />
            <Modal open={openId !== 0} onClose={() => setOpenId(0)} >
                <div className="modal">
                    <OrderForm id={openId} onUpdate={action}/>
                </div>
            </Modal>
        </div>
    );
};

export default Orders;