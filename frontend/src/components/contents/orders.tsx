import React, { FunctionComponent } from "react";
import Content from "../content";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import data from "../../data.json";


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
            {
                orders.map(order => (
                    <div>
                        <Content key={order.id} name="order">
                            <div><img src={data["site-url"] + order?.product?.image} alt={order?.product?.name}/></div>
                            <div>{order.product?.name} {order.product?.model}</div>
                            <div>{order.count}</div>
                            <div>${order.totalPrice}</div>
                            <div>{order.status}</div>
                            <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteOrder(id: ${order.id})  {id}}`} />
                        </Content>
                    </div>
                ))
            }
        </div>  
    );
};

export default Orders;