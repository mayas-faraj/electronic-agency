import React, { FunctionComponent } from "react";
import View from "../view";
import { AccountCircle, Flag, HistoryToggleOff, LockClock, MilitaryTech, MoreTime } from "@mui/icons-material";

const Admin: FunctionComponent<{id: number}> = ({ id }) => {
  return (
    <View 
    title="Admin details"
    command={`query { user(id: ${id}) { user role isDisabled createdAt updatedAt lastLoginAt } }`}
    headers={[
        {key: "user", title: "User Name", icon: <AccountCircle />},
        {key: "role", title: "User Role", icon: <MilitaryTech />},
        {key: "isDisabled", title: "Active Status", icon: <Flag />},
        {key: "createdAt", title: "Creation Date", icon: <MoreTime />},
        {key: "updatedAt", title: "Updated Date", icon: <HistoryToggleOff />},
        {key: "lastLoginAt", title: "Last Login Date", icon: <LockClock />},
    ]}
    />
  )
}

export default Admin