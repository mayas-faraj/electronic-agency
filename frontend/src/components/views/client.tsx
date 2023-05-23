import React, { FunctionComponent } from "react";
import View from "../view";
import { AccountCircle, CreditCard, Email, Event, Flag, HistoryToggleOff, LockClock, MoreTime, Smartphone, Wc } from "@mui/icons-material";

const Client: FunctionComponent<{id: number}> = ({ id }) => {
  return (
    <View 
    title="Client details"
    command={`query { client(id: ${id}) { user phone email firstName lastName birthDate isMale isDisabled createdAt updatedAt lastLoginAt } }`}
    headers={[
        {key: "user", title: "Client Name", icon: <AccountCircle />},
        {key: "phone", title: "Phone", icon: <Smartphone />},
        {key: "email", title: "Email", icon: <Email />},
        {key: "firstName", title: "First name", icon: <CreditCard />},
        {key: "lastName", title: "Last Name", icon: <CreditCard />},
        {key: "birthDate", title: "Birthdate", icon: <Event />},
        {key: "isMale", title: "Gender", icon: <Wc />},
        {key: "isDisabled", title: "Active Status", icon: <Flag />},
        {key: "createdAt", title: "Creation Date", icon: <MoreTime />},
        {key: "updatedAt", title: "Updated Date", icon: <HistoryToggleOff />},
        {key: "lastLoginAt", title: "Last Login Date", icon: <LockClock />},
    ]}
    />
  )
}

export default Client