import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { TicketNotificationIcon, OrderNotificationIcon } from "./notification-icon";
import logoImage from "../assets/imgs/logo.png";
import ProfileContext from "./profile-context";
import { Divider, IconButton } from "@mui/material";
import styles from "../styles/header.module.scss";
import { AccountCircle, AdminPanelSettings, Category, ListAlt, RoomPreferences, Redeem, BurstModeRounded } from "@mui/icons-material";

const Header: FunctionComponent = () => {
  // privileges
  const profile = React.useContext(ProfileContext);

  // component states
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = React.useState<HTMLElement | null>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  // medel menu
  interface ILink {
    title: string;
    to: string;
    icon: JSX.Element;
  }

  const hidenMenuCondition = !profile.privileges.updateClient && (profile.privileges.createOrder || profile.privileges.createTicket || profile.privileges.updateTicket);

  const links: ILink[] = [];
  if (profile.privileges.readAdmin) links.push({ title: "Admins", to: "/admins", icon: <AdminPanelSettings /> });
  if (profile.privileges.readClient && !hidenMenuCondition) links.push({ title: "Clients", to: "/clients", icon: <AccountCircle /> });
  if (profile.privileges.readCategory && !hidenMenuCondition) links.push({ title: "Categories", to: "/categories", icon: <Category /> });
  if (profile.privileges.readProduct && !hidenMenuCondition) links.push({ title: "Products", to: "/products", icon: <Redeem /> });
  if (profile.privileges.readAdvertisement) links.push({ title: "Advertisements", to: "/advertisements", icon: <BurstModeRounded /> });
  if (profile.privileges.readOrder) links.push({ title: "Orders", to: "/orders", icon: <ListAlt /> });
  if (profile.privileges.readTicket) links.push({ title: "Tickets", to: "/tickets", icon: <RoomPreferences /> });

  // event handlers
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  // menu elements
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={styles["context-menu"]}
    >
      <MenuItem>
        <Link to="/password">Change Password</Link>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Link to="/login">Logout</Link>
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      className={styles["mobile-menu"]}
    >
      {links.map((link) => (
        <MenuItem key={link.title}>
          {link.icon}
          <Link to={link.to}>{link.title}</Link>
        </MenuItem>
      ))}
      {profile.privileges.readOrder && (
        <MenuItem>
          <OrderNotificationIcon />
          Orders
        </MenuItem>
      )}
      {profile.privileges.readTicket && (
        <MenuItem>
          <TicketNotificationIcon />
          Ticket
        </MenuItem>
      )}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        Profile
      </MenuItem>
    </Menu>
  );

  return (
    <div className={styles.wrapper}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
          <IconButton>
            <Link to="/">
              <img src={logoImage} alt="alardh-alsalba logo" className={styles.logo} />
            </Link>
          </IconButton>
          <div className={styles.hide_small}>
            <div className={styles["main-menu"]}>
              {links.map((link) => (
                <Link key={link.title} to={link.to}>
                  {link.title}
                </Link>
              ))}
            </div>
            {profile.privileges.readOrder && <OrderNotificationIcon />}
            {profile.privileges.readTicket && <TicketNotificationIcon />}
            <IconButton size="large" edge="end" onClick={handleProfileMenuOpen} color="inherit">
              <AccountCircle />
            </IconButton>
          </div>
          <div className={styles.hide_large}>
            <IconButton size="large" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default Header;
