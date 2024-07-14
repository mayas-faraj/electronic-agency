import React from "react";
import RoleContext from "../components/role-context";
import { AdminInfoBlock, ClientInfoBlock, TicketInfoBlock, OrderInfoBlock, ProductInfoBlock } from "./info-block";
import styles from "../styles/dashboard.module.scss";

const Dashboard = () => {
  const privileges = React.useContext(RoleContext);

  return (
    <div className={styles.wrapper}>
        { privileges.readAdmin && <AdminInfoBlock />}
        { privileges.readClient && <ClientInfoBlock />}
        { privileges.readOrder && <OrderInfoBlock />}
        { privileges.readTicket && <TicketInfoBlock />}
        { privileges.readProduct && <ProductInfoBlock />}
    </div>
  )
};

export default Dashboard;
