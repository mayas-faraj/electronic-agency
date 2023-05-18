import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { CellDataTransform, ITableHeader } from "../content-table";
import data from "../../data.json";

// types
interface Product {
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
const Products: FunctionComponent<{ categoryId: number }> = ({ categoryId }) => {
    // product state
    const [products, setProducts] = React.useState<Product[]>([]);

    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Image" },
        { key: "name", title: "Name" },
        { key: "model", title: "Model" },
        { key: "isDisabled", title: "Disable", dataTransform: CellDataTransform.switch },
        { key: "delete", title: "Delete", dataTransform: CellDataTransform.button },
    ];
    // on load
    const action = async () => {
        const result1 = await getServerData(`query { products(categoryId: ${1}) { id name model image description price isDisabled }}`)
        const result2 = await getServerData(`query { products(categoryId: ${2}) { id name model image description price isDisabled }}`)
        setProducts([...result1.data.products, ...result2.data.products]);
    };
    React.useEffect(() => {
        action();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    // render
    return (
        <div>
            {
                <ContentTable name="product" headers={tableHeader} data={
                    products.map(product => ({
                        image: <img src={data["site-url"] + product.image} alt={product.name} />,
                        name: product.name,
                        model: product.model,
                        isDisabled: <Management onUpdate={() => action()} type={ManagementType.switch} operation={Operation.update} command={`mutation { updateProduct(id: ${product.id}, input: {isDisabled: ${true}})  {id name model}}`} />,
                        delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteProduct(id: ${product.id})  {id name model}}`} />
                    }))
                } />
            }
        </div>
    );
};

export default Products;