import React, { FunctionComponent } from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";
import ProductItem from "../content-forms/product-item";

// types
interface IProductItem {
    sn: string
    createdAt: string
}

// main component
const ProductItems: FunctionComponent<{ productId: number }> = ({ productId }) => {
    // productItem state
    const [productItems, setProductItems] = React.useState<IProductItem[]>([]);
    const [editSn, setEditSn] = React.useState("");

    // context
    const privileges = React.useContext(RoleContext);

    // productItem schema
    const tableHeader: ITableHeader[] = [
        { key: "sn", title: "SN" },
        { key: "createdAt", title: "Creation Date" },
        { key: "edit", title: "Edit", isControlType: true },
        { key: "delete", title: "Delete", isControlType: true },
    ];
    // on load
    const action = async () => {
        setEditSn("");
        const result = await getServerData(`query { product(id: ${productId}) { items { sn createdAt} } }`);
        setProductItems(result.data.product.items);
    };

    // event handler
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { product(id: ${productId}) { items { sn createdAt} } }`)
            setProductItems(result.data.product.items);
        };
        action();
    }, [productId]);

    // render
    return (
        <div>
            <ProductItem productId={productId} productItemSn={editSn} onUpdate={action}/>
            <ContentTable
                name="productItem"
                headers={tableHeader}
                canRead={privileges.readProductItem}
                canWrite={privileges.writeProductItem}
                hasSnColumn={true}
                data={
                    productItems.map(productItem => ({
                        sn: productItem.sn,
                        createdAt: new Date(parseInt(productItem.createdAt)).toLocaleString(),
                        edit: <Button variant="text" color="success" onClick={() => setEditSn(productItem.sn)}><EditIcon /></Button>,
                        delete: <Management type={ManagementType.button} operation={Operation.delete} command={`mutation { deleteProductItem(sn: "${productItem.sn}")  {sn createdAt}}`} hasConfirmModal={true} onUpdate={action} />
                    }))
                } />
        </div>
    );
};

export default ProductItems;