import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import data from "../../data.json";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";

// types
interface Order {
    id: number
    count: string
    totalPrice: string
    status: boolean
    createdAt: Date
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

    // context
    const privileges = React.useContext(RoleContext);

    // order schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Product Image", isSpecialType: true },
        { key: "product", title: "Product" },
        { key: "count", title: "Count" },
        { key: "totalPrice", title: "Total price" },
        { key: "status", title: "Status" },
        { key: "delete", title: "Delete", isControlType: true },
    ];

    // on load
    const action = async () => {
        const result = await getServerData(`query { orders { id count totalPrice status createdAt product{name image model}  }}`)
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
                    product: order.product?.name,
                    count: order.count,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteOrder(id: ${order.id})  {id}}`} />
                }))
            } />
        </div>
    );
};

export default Orders;