import React, { FunctionComponent } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import getServerData from "../libs/server-data";

interface NotificationIconProps {
  icon: JSX.Element;
  readCount: () => Promise<number>;
}

const interval = 12000;

const NotificationIcon: FunctionComponent<NotificationIconProps> = ({
  icon,
  readCount,
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const action = async () => {
      const countResult = await readCount();
      setCount(countResult);
    };
    action();

    const timer = setInterval(() => {
      action();
    }, interval);

    return () => clearInterval(timer);
  }, [readCount, count]);
  return (
    <IconButton size="large" color="inherit">
      <Badge badgeContent={count} color="secondary">
        {icon}
      </Badge>
    </IconButton>
  );
};

const OrderNotificationIcon: FunctionComponent = () => {
  const readUnreadOrdersCount = async () => {
    const result = await getServerData(`query { ordersUnreadCount { count } }`);
    return result.data.ordersUnreadCount.count;
  };

  return (
    <NotificationIcon
      icon={<ListAltIcon />}
      readCount={readUnreadOrdersCount}
    />
  );
};

const MaintenanceNotificationIcon: FunctionComponent = () => {
  const readUnreadMaintenancesCount = async () => {
    const result = await getServerData(`query { maintenancesUnreadCount { count } }`);
    return result.data.maintenancesUnreadCount.count;
  };

  return (
    <NotificationIcon
      icon={<RoomPreferencesIcon />}
      readCount={readUnreadMaintenancesCount}
    />
  );
};

export { OrderNotificationIcon, MaintenanceNotificationIcon };
export default NotificationIcon;
