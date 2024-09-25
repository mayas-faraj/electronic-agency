import React from "react";
import ProfileContext from "./profile-context";
import { AdminInfoBlock, ClientInfoBlock, TicketInfoBlock, OrderInfoBlock, ProductInfoBlock } from "./info-block";
import styles from "../styles/dashboard.module.scss";

const Dashboard = () => {
  const profile = React.useContext(ProfileContext);

  return (
    <div className={styles.wrapper}>
        { profile.privileges.readAdmin && <AdminInfoBlock />}
        { profile.privileges.readClient && <ClientInfoBlock />}
        { profile.privileges.readOrder && <OrderInfoBlock />}
        { profile.privileges.readTicket && <TicketInfoBlock />}
        { profile.privileges.readProduct && <ProductInfoBlock />}
    </div>
  )
};

export default Dashboard;
