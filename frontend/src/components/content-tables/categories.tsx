import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";

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

    // context
    const privileges = React.useContext(RoleContext);

    // category schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Image", isSpecialType: true},
        { key: "name", title: "Name"},
        { key: "delete", title: "Delete", isControlType: true},
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
            <ContentTable name="category" headers={tableHeader} canRead={privileges.readCategory} canWrite={privileges.writeCategory} data={
                categories.map(category => ({
                    name: category.name,
                    image: <img src={data["site-url"] + category.image} alt={category.name}/>,
                    delete: <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteCategory(id: ${category.id})  {id name model}}`} />
                }))
        } />
        </div>  
    );
};

export default Categories;