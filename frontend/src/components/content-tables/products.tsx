import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import ProductForm from "../content-forms/product";
import ProductView from "../views/product";
import data from "../../data.json";
import RoleContext from "../role-context";
import { Visibility } from "@mui/icons-material";

// types
interface IProduct {
    id: number
    categoryId: number
    name: string
    model: string
    image?: string
    description?: string
    price: number
    isDisabled: boolean
    createdAt: Date
}

// main component
const Products: FunctionComponent = () => {
    // product state
    const [products, setProducts] = React.useState<IProduct[]>([]);
    const [editId, setEditId] = React.useState(0);
    const [viewId, setViewId] = React.useState(0);

    // context
    const privileges = React.useContext(RoleContext);

    // product schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Image", isSpecialType: true },
        { key: "name", title: "Name" },
        { key: "model", title: "Model" },
        { key: "isDisabled", title: "Disable", isControlType: true },
        { key: "view", title: "More Info", isSpecialType: true },
        { key: "edit", title: "Edit", isControlType: true },
        { key: "delete", title: "Delete", isControlType: true },
    ];
    // on load
    const action = async () => {
        const result1 = await getServerData(`query { products(categoryId: ${1}) { id name model image description price isDisabled }}`)
        const result2 = await getServerData(`query { products(categoryId: ${2}) { id name model image description price isDisabled }}`)
        setProducts([...result1.data.products, ...result2.data.products]);
    };

    // event handler
    React.useEffect(() => {
        action();
    }, []);

    // render
    return (
        <div>
            <ContentTable
                name="product"
                headers={tableHeader}
                canRead={privileges.readProduct}
                canWrite={privileges.writeProduct}
                hasSnColumn={true}
                addNewLink="/add-product"
                data={
                    products.map(product => ({
                        image: <img src={data["site-url"] + product.image} alt={product.name} />,
                        name: product.name,
                        model: product.model,
                        isDisabled: <Management type={ManagementType.switch} operation={Operation.update} command={`mutation { updateProduct(id: ${product.id}, input: {isDisabled: ${!product.isDisabled}})  {id name model}}`} initialValue={product.isDisabled} onUpdate={() => action()} />,
                        view: <Button variant="text" color="info" onClick={() => setViewId(product.id)}><Visibility /></Button>,
                        edit: <Button variant="text" color="success" onClick={() => setEditId(product.id)}><EditIcon /></Button>,
                        delete: <Management type={ManagementType.button} operation={Operation.delete} command={`mutation { deleteProduct(id: ${product.id})  {id name model}}`} hasConfirmModal={true} onUpdate={action} />
                    }))
                } />
            <Modal open={editId !== 0} onClose={() => setEditId(0)} >
                <div className="modal">
                    <ProductForm id={editId} onUpdate={() => action()} />
                </div>
            </Modal>
            <Modal open={viewId !== 0} onClose={() => setViewId(0)} >
                <div className="modal">
                    <ProductView id={viewId} />
                </div>
            </Modal>
        </div>
    );
};

export default Products;