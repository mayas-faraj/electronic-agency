import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Visibility, Category } from "@mui/icons-material";
import CategoryForm from "../content-forms/category";
import CategoryView from "../views/category";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import ProfileContext from "../profile-context";
import { Link } from "react-router-dom";

// types
interface ICategory {
    id: number
    name: string
    image?: string
}

// main component
const Categories: FunctionComponent = () => {
    // category state
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [editId, setEditId] = React.useState(0);
    const [viewId, setViewId] = React.useState(0);

    // context
    const profile = React.useContext(ProfileContext);

    // category schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Image", type: HeaderType.SPECIAL },
        { key: "name", title: "Name" },
        { key: "view", title: "More Info", type: HeaderType.SPECIAL},
        { key: "subcategory", title: "Subcategories", type: HeaderType.SPECIAL},
        { key: "edit", title: "Edit", type: HeaderType.UPDATE },
        { key: "delete", title: "Delete", type: HeaderType.DELETE },
    ];

    // on load
    const action = async () => {
        const result = await getServerData(`query { categories(filter: {showDisabled: true}) { id name image }}`);
        setCategories(result.data.categories);
    };

    React.useEffect(() => {
        action();
    }, []);

    // render
    return (
        <div>
            <ContentTable
                name="category"
                headers={tableHeader}
                addNewLink="/add-category"
                canCreate={profile.privileges.createCategory}
                canDelete={profile.privileges.deleteCategory}
                canRead={profile.privileges.readCategory}
                canUpdate={profile.privileges.updateCategory}
                data={
                    categories.map(category => ({
                        name: category.name,
                        image: <img src={data["media-service-url"] + category.image} alt={category.name} />,
                        view: <Button variant="text" color="info" onClick={() => setViewId(category.id)}><Visibility /></Button>,
                        subcategory: <Button variant="text" color="primary"><Link to={`/sub-categories/${category.id}`}><Category /></Link></Button>,
                        edit: <Button variant="text" color="success" onClick={() => setEditId(category.id)}><EditIcon /></Button>,
                        delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteCategory(id: ${category.id})  {id name}}`} />
                    }))
                } />
            <Modal open={editId !== 0} onClose={() => setEditId(0)} >
                <div className="modal">
                    <CategoryForm id={editId} onUpdate={() => action()} />
                </div>
            </Modal>
            <Modal open={viewId !== 0} onClose={() => setViewId(0)} >
                <div className="modal">
                    <CategoryView id={viewId} />
                </div>
            </Modal>
        </div>
    );
};

export default Categories;