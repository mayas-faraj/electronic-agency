import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { SvgIconProps } from "@mui/material";
import { AccountCircle, AdminPanelSettings, HourglassBottom, ListAlt, Redeem, RoomPreferences } from "@mui/icons-material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import getServerData from "../libs/server-data";
import styles from "../styles/info-block.module.scss";

interface IInfoBlockProps {
    title: string
    info: string
    icon: React.ReactElement<SvgIconProps>
    description?: string
    isWide?: boolean
    url?: string
}

const InfoBlock: FunctionComponent<IInfoBlockProps> = ({ title, description, info, icon, isWide, url }) => {
    return (
        <div className={styles.wrapper + (isWide === true ? " " + styles.wide : "")}>
            { url != null && <Link to={url ?? '#'} className={styles["readmore-link"]}><ReadMoreIcon /></Link>}
            <div className={styles.icon_wrapper}>{icon}</div>
            <div className={styles.info_wrapper}>
                <strong className={styles.title}><Link to={url ?? '#'}>{title}</Link></strong>
                <p className={styles.info}>{info}</p>
                {description != null && <p className={styles.description}>{description}</p>}
            </div>
        </div>
    );
};

const emptyInfo: IInfoBlockProps = {
    title: "Getting data...",
    description: "-",
    info: "-",
    icon: <HourglassBottom />,
};

export const AdminInfoBlock = () => {
    // const component state
    const [info, setInfo] = React.useState<IInfoBlockProps>(emptyInfo);

    // side effect compenent load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { usersCount { count date }}`);
            setInfo({
                icon: <AdminPanelSettings />,
                title: "System Admins",
                info: `${result.data.usersCount.count}  admins`,
                url: "/admins",
                description: `Admin can create admins, sales man, technical user and product manager users, 
            last admin created to system at: ${new Date(parseInt(result.data.usersCount.date)).toLocaleDateString()}`
            });
        }
        action();
    }, []);

    // render

    return <InfoBlock {...info} />
}

export const ClientInfoBlock = () => {
    // const component state
    const [info, setInfo] = React.useState<IInfoBlockProps>(emptyInfo);

    // side effect compenent load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { clientsCount { count date }}`);
            setInfo({
                icon: <AccountCircle />,
                title: "App Clients",
                info: `${result.data.clientsCount.count}  clients`,
                url: "/clients",
                description: `Client who can use the app, 
                last client registered at: ${new Date(parseInt(result.data.clientsCount.date)).toLocaleDateString()}`
            });
        }
        action();
    }, []);

    // render
    return <InfoBlock {...info} />
}

export const TicketInfoBlock = () => {
    // const component state
    const [info, setInfo] = React.useState<IInfoBlockProps>(emptyInfo);

    // side effect compenent load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { ticketCount }`, true);
            setInfo({
                icon: <RoomPreferences />,
                title: "Tickets Schedule",
                info: `${result.data?.ticketsCount ?? 0} tickets`,
                url: "/tickets",
                description: `ticket operations that request from user, 
                last ticket registered at: ${new Date().toLocaleDateString()}`
            });
        }
        action();
    }, []);

    // render
    return <InfoBlock {...info} />
}

export const OrderInfoBlock = () => {
    // const component state
    const [info, setInfo] = React.useState<IInfoBlockProps>(emptyInfo);

    // side effect compenent load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { ordersCount { count date sum }}`);
            setInfo({
                icon: <ListAlt />,
                title: "Client Orders",
                info: `${result.data.ordersCount.sum} ordered products`,
                isWide: false,
                url: "/orders",
                description: `order that generate from user to buy products, there are ${result.data.ordersCount.count} orders,
                the last order created from client is registered at: ${new Date(parseInt(result.data.ordersCount.date)).toLocaleDateString()}`
            });
        }
        action();
    }, []);

    // render
    return <InfoBlock {...info} />
}


export const ProductInfoBlock = () => {
    // const component state
    const [info, setInfo] = React.useState<IInfoBlockProps>(emptyInfo);

    // side effect compenent load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { productsCount { count date }}`);
            setInfo({
                icon: <Redeem />,
                title: "Products",
                info: `${result.data.productsCount.count} products`,
                isWide: false,
                url: "/products",
                description: `product that generate from user to buy products, 
                last product registered at: ${new Date(parseInt(result.data.productsCount.date)).toLocaleDateString()}`
            });
        }
        action();
    }, []);

    // render
    return <InfoBlock {...info} />
}

export default InfoBlock;