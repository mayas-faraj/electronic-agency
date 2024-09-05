import React, { FunctionComponent } from "react";
import View from "../view";
import { AccountCircle, Apartment, Build, CreditCard, Email, Event, Flag, HistoryToggleOff, Hotel, House, LocationOn, LockClock, MoreTime, Smartphone, Wc } from "@mui/icons-material";

const Client: FunctionComponent<{ user: string }> = ({ user }) => {
  return (
    <View
      title="Client details"
      command={`query { clientByUser(user: "${user}") { user phone phone2 email address address2 company firstName lastName birthDate isMale isDisabled createdAt updatedAt lastLoginAt } }`}
      headers={[
        { key: "user", title: "Client Name", icon: <AccountCircle /> },
        { key: "phone", title: "Phone", icon: <Smartphone /> },
        { key: "phone2", title: "Phone (Secondary)", icon: <Smartphone /> },
        { key: "email", title: "Email", icon: <Email /> },
        { key: "address", title: "Address", icon: <LocationOn /> },
        { key: "address2", title: "Address (Secondary)", icon: <LocationOn /> },
        { key: "company", title: "Company", icon: <Apartment /> },
        { key: "firstName", title: "First name", icon: <CreditCard /> },
        { key: "lastName", title: "Last Name", icon: <CreditCard /> },
        { key: "birthDate", title: "Birthdate", icon: <Event /> },
        { key: "isMale", title: "Gender", icon: <Wc /> },
        { key: "isDisabled", title: "Active Status", icon: <Flag /> },
        { key: "createdAt", title: "Creation Date", icon: <MoreTime /> },
        { key: "updatedAt", title: "Updated Date", icon: <HistoryToggleOff /> },
        { key: "lastLoginAt", title: "Last Login Date", icon: <LockClock /> }
      ]}
    />
  );
};

export default Client;
