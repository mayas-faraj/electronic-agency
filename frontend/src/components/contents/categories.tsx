import React, { FunctionComponent } from "react";
import Content from "../content";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import Management, { ManagementType, Operation } from "../management";

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
            {
                categories.map(category => (
                    <div>
                        <Content key={category.name} name="category">
                            <div><img src={data["site-url"] + category.image} alt={category.name}/></div>
                            <div>{category.name}</div>
                            <Management onUpdate={() => action() } type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteCategory(id: ${category.id})  {id name model}}`} />
                        </Content>
                    </div>
                ))
            }
        </div>  
    );
};

export default Categories;