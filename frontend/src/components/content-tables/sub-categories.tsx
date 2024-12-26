import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Visibility } from "@mui/icons-material";
import SubCategoryForm from "../content-forms/sub-category";
import SubCategoryView from "../views/sub-category";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import ProfileContext from "../profile-context";

// types
interface ISubCategory {
    id: number
    name: string
    image?: string
    category: {
        id: number
        name: string
    }
}

// main component
const SubCategories: FunctionComponent<{categoryId: number}> = ({ categoryId }) => {
    // category state
    const [subCategories, setSubCategories] = React.useState<ISubCategory[]>([]);
    const [editId, setEditId] = React.useState(0);
    const [viewId, setViewId] = React.useState(0);

    // context
    const profile = React.useContext(ProfileContext);

    // category schema
    const tableHeader: ITableHeader[] = [
        { key: "image", title: "Image", type: HeaderType.SPECIAL },
        { key: "name", title: "Name" },
        { key: "view", title: "More Info", type: HeaderType.SPECIAL},
        { key: "edit", title: "Edit", type: HeaderType.UPDATE },
        { key: "delete", title: "Delete", type: HeaderType.DELETE },
    ];

    // on load
    const action = async () => {
        const result = await getServerData(`query { subCategories (categoryId: ${categoryId}) { id name image }}`);
        setSubCategories(result.data.subCategories);
    };

    React.useEffect(() => {
        action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // render
    return (
        <div>
            <ContentTable
                name="sub-category"
                headers={tableHeader}
                addNewLink={"/add-sub-category/" + categoryId.toString()} 
                canCreate={profile.privileges.createCategory}
                canDelete={profile.privileges.deleteCategory}
                canRead={profile.privileges.readCategory}
                canUpdate={profile.privileges.updateCategory}
                data={
                    subCategories.map(subCategory => ({
                        name: subCategory.name,
                        image: <img src={data["media-service-url"] + subCategory.image} alt={subCategory.name} />,
                        view: <Button variant="text" color="info" onClick={() => setViewId(subCategory.id)}><Visibility /></Button>,
                        edit: <Button variant="text" color="success" onClick={() => setEditId(subCategory.id)}><EditIcon /></Button>,
                        delete: <Management onUpdate={() => action()} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} command={`mutation { deleteSubCategory(id: ${subCategory.id})  {id name}}`} />
                    }))
                } />
            <Modal open={editId !== 0} onClose={() => setEditId(0)} >
                <div className="modal">
                    <SubCategoryForm id={editId} categoryId={categoryId} onUpdate={() => action()} />
                </div>
            </Modal>
            <Modal open={viewId !== 0} onClose={() => setViewId(0)} >
                <div className="modal">
                    <SubCategoryView id={viewId} />
                </div>
            </Modal>
        </div>
    );
};

export default SubCategories;