import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { CellDataTransform, ITableHeader } from "../content-table";

// types
interface Category {
    id: number
    name: string
    image?: string
}

// main component
const Categories: FunctionComponent = () => {
    // category state
    const [categories, setCategories] = React.useState<Category[]>([]);

    // category schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Image"},
        { key: "name", title: "Name"},
        { key: "delete", title: "Delete", dataTransform: CellDataTransform.button},
    ];

    // on load
    const action = async () => {
        const result = await getServerData(`query { categories { id name image }}`)
        setCategories(result.data.categories);
    };

    React.useEffect(() => {   
        action();
    }, []);

    // render
    return (
        <div>
            <ContentTable name="category" headers={tableHeader} data={
                categories.map(category => ({
                    ...category,
                    image: <img src={data["site-url"] + category.image} alt={category.name}/>,
                    delete: <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteCategory(id: ${category.id})  {id name model}}`} />
                }))
        } />
        </div>  
    );
};

export default Categories;