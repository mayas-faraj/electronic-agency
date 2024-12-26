import React, { FunctionComponent } from "react";
import View from "../view";
import { Category, Flag, HistoryToggleOff, LocalAtm, MoreTime, Redeem, Star } from "@mui/icons-material";

const Product: FunctionComponent<{id: number}> = ({ id }) => {
  return (
    <View 
    title="Product details"
    command={`query { product(id: ${id}) { name nameTranslated model image price point createdAt updatedAt isDisabled } }`}
    headers={[
        {key: "name", title: "Product Name", icon: <Redeem />},
        {key: "nameTranslated", title: "Product Name (Arabic)", icon: <Redeem />},
        {key: "model", title: "Model", icon: <Category />},
        {key: "price", title: "Price", icon: <LocalAtm />},
        {key: "point", title: "Point", icon: <Star />},
        {key: "isDisabled", title: "Active Status", icon: <Flag />},
        {key: "createdAt", title: "Creation Date", icon: <MoreTime />},
        {key: "updatedAt", title: "Updated Date", icon: <HistoryToggleOff />},
    ]}
    />
  )
}

export default Product