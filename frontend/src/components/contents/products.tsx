import React, { FunctionComponent } from "react";
import Content from "../content";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
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

    // on load
    const action = async () => {
        const result = await getServerData(`query { products(categoryId: ${categoryId}) { id name model image description price isDisabled }}`)
        setProducts(result.data.products);
    };

    React.useEffect(() => {   
        action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    // render
    return (
        <div>
            {
                products.map(product => (
                    <div>
                        <Content key={product.name + product.model} name="product">
                            <div><img src={data["site-url"] + product.image} alt={product.name}/></div>
                            <div>{product.name}</div>
                            <div>{product.model}</div>
                            <Management onUpdate={() => action() } type={ManagementType.switch} operation={Operation.update} command={`mutation { updateProduct(id: ${product.id}, input: {isDisabled: ${true}})  {id name model}}`} />
                            <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteProduct(id: ${product.id})  {id name model}}`} />
                        </Content>
                    </div>
                ))
            }
        </div>  
    );
};

export default Products;