import React, { FunctionComponent } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import RedeemIcon from "@mui/icons-material/Redeem";
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import getServerData from "../libs/server-data";

interface NotificationIconProps {
  icon: JSX.Element
  count: number
}

const NotificationIcon: FunctionComponent<NotificationIconProps> = ({ icon, count }) => {
  return (
    <IconButton size="large" color="inherit">
      <Badge badgeContent={count} color="secondary">{icon}</Badge>
    </IconButton>
  );
};

const OrderNotificationIcon: FunctionComponent = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const action = async () => {
      const result = await getServerData(`query {
        ordersUnreadCount {
          count
        }
      }
      `);
      setCount(result.data.ordersUnreadCount.count);
    };
    action(); 
  }, []);

  return (
    <NotificationIcon icon={<RedeemIcon />} count={count}/>
  );
};

const MaintenanceNotificationIcon: FunctionComponent = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const action = async () => {
      const result = await getServerData(`query {
        maintenancesUnreadCount {
          count
        }
      }
      `);
      setCount(result.data.maintenancesUnreadCount.count);
    };
    action(); 
  }, []);

  return (
    <NotificationIcon icon={<RoomPreferencesIcon />} count={count}/>
  );
};

export { OrderNotificationIcon, MaintenanceNotificationIcon};
export default NotificationIcon;
