import React, { FunctionComponent } from "react";
import View from "../view";
import { Category as CategoryIcon, Flag, HistoryToggleOff, MoreTime } from "@mui/icons-material";

const Category: FunctionComponent<{id: number}> = ({ id }) => {
  return (
    <View 
    title="Category details"
    command={`query { category(id: ${id}) { name image isDisabled createdAt updatedAt } }`}
    headers={[
        {key: "name", title: "User Name", icon: <CategoryIcon />},
        {key: "isDisabled", title: "Active Status", icon: <Flag />},
        {key: "createdAt", title: "Creation Date", icon: <MoreTime />},
        {key: "updatedAt", title: "Updated Date", icon: <HistoryToggleOff />},
    ]}
    />
  )
}

export default Category