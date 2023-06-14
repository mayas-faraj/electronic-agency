import React, { FunctionComponent } from "react";
import View from "../view";
import { Category as CategoryIcon, Flag, HistoryToggleOff, MoreTime } from "@mui/icons-material";

const SubCategory: FunctionComponent<{id: number}> = ({ id }) => {
  return (
    <View 
    title="SubCategory details"
    command={`query { subCategory(id: ${id}) { name nameTranslated image isDisabled createdAt updatedAt } }`}
    headers={[
        {key: "name", title: "SubCategory Name", icon: <CategoryIcon />},
        {key: "nameTranslated", title: "SubCategory Name (Arabic)", icon: <CategoryIcon />},
        {key: "isDisabled", title: "Active Status", icon: <Flag />},
        {key: "createdAt", title: "Creation Date", icon: <MoreTime />},
        {key: "updatedAt", title: "Updated Date", icon: <HistoryToggleOff />},
    ]}
    />
  )
}

export default SubCategory