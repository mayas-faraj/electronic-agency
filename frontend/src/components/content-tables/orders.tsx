import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { Email, Drafts } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import OrderForm from "../content-forms/order";
import getServerData from "../../libs/server-data";
import ProfileContext from "../profile-context";
import data from "../../data.json";

// types
interface Order {
  id: number;
  status: string;
  createdAt: string;
  isOfferRequest: boolean;
  isRead: boolean;
  products: {
    product: {
      name: string;
      model: string;
      image: string;
    };
    count: number;
    price: number;
  }[];
}

// main component
const Orders: FunctionComponent = () => {
  // order state
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [openId, setOpenId] = React.useState(0);

  // context
  const profile = React.useContext(ProfileContext);

  // order schema
  const tableHeader: ITableHeader[] = [
    { key: "image", title: "Product Image", type: HeaderType.SPECIAL },
    { key: "products", title: "Products" },
    { key: "createdAt", title: "Order Date" },
    { key: "totalCount", title: "Count" },
    { key: "totalPrice", title: "Total price" },
    { key: "view", title: "Open", type: HeaderType.SPECIAL },
    { key: "status", title: "Status" },
    { key: "delete", title: "Delete", type: HeaderType.DELETE }
  ];

  // on load
  const action = async () => {
    const result = await getServerData(`query { orders { id isOfferRequest isRead status createdAt products { product { name image model } count price }}}`);
    setOrders(result.data.orders);
  };

  React.useEffect(() => {
    action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render
  return (
    <div>
      <ContentTable
        name="order"
        headers={tableHeader}
        canCreate={profile.privileges.createOrder}
        canDelete={profile.privileges.deleteOrder}
        canRead={profile.privileges.readOrder}
        canUpdate={profile.privileges.updateOrder}
        addNewLink="/add-order"
        data={orders.map((order) => ({
          image: <img src={data["site-url"] + order.products[0]?.product.image} alt={order.products[0]?.product.name} />,
          products: order.products.map((orderProduct) => `${orderProduct.product.name} (${orderProduct.product.model})`).join("\n"),
          totalCount: order.products.reduce((acc, product) => acc + product.count, 0),
          totalPrice: order.isOfferRequest ? "Offer Request" : order.products.reduce((acc, product) => acc + product.price, 0),
          createdAt: new Date(parseInt(order.createdAt)).toLocaleString(),
          view: (
            <Button variant="text" color="info" onClick={() => setOpenId(order.id)}>
              {order.isRead ? <Drafts /> : <Email />}
            </Button>
          ),
          status: <span className={`status-${order.status.toLowerCase()}`}>{order.status.toLowerCase()}</span>,
          delete: (
            <Management
              onUpdate={() => action()}
              type={ManagementType.button}
              hasConfirmModal={true}
              operation={Operation.delete}
              command={`mutation { deleteOrder(id: ${order.id})  {id}}`}
            />
          )
        }))}
      />
      <Modal open={openId !== 0} onClose={() => setOpenId(0)}>
        <div className="modal">
          <OrderForm id={openId} onUpdate={action} />
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
