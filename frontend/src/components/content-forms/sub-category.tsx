import React, { FunctionComponent } from "react";
import { FormControl, MenuItem, Select, Switch, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import ImageUpload from "../image-upload";

const initialInfo = {
    name: "",
    nameTranslated: "",
    categoryId: 1,
    image: "",
    isDisabled: false
};

interface ISubCategoryProps {
    id?: number
    categoryId?: number
    onUpdate?: () => void
}

const SubCategory: FunctionComponent<ISubCategoryProps> = ({ id, categoryId, onUpdate }) => {
    // component reducer and state
    const [info, dispatch] = React.useReducer(reducer, initialInfo);
    const [categories, setCategories] = React.useState<Array<{ id: number, name: string }>>([]);

    // process form type (create or update)
    const subCategoryCommand = id === undefined ?
        `mutation { createSubCategory(input: { name: "${(info.name as string).trim()}",nameTranslated: "${(info.nameTranslated as string).trim()}", categoryId: ${info.categoryId}, image: "${info.image}" }) { id name } }` :
        `mutation { updateSubCategory(id: ${id}, input: { name: "${(info.name as string).trim()}",nameTranslated: "${(info.nameTranslated as string).trim()}", categoryId: ${info.categoryId}, image: "${info.image}", isDisabled: ${info.isDisabled}}) { id name } }`;

    // load data function
    const action = async () => {
        if (id !== undefined) {
            const result = await getServerData(`query { subCategory(id: ${id}) { id name nameTranslated categoryId image isDisabled } }`);
            dispatch({ type: "set", key: "name", value: result.data.subCategory.name });
            dispatch({ type: "set", key: "nameTranslated", value: result.data.subCategory.nameTranslated });
            dispatch({ type: "set", key: "categoryId", value: result.data.subCategory.categoryId });
            dispatch({ type: "set", key: "image", value: result.data.subCategory.image });
            dispatch({ type: "set", key: "isDisabled", value: result.data.subCategory.isDisabled });
        } else {
            dispatch({ type: "set", key: "name", value: initialInfo.name });
            dispatch({ type: "set", key: "nameTranslated", value: initialInfo.nameTranslated });
            dispatch({ type: "set", key: "categoryId", value: initialInfo.categoryId });
            dispatch({ type: "set", key: "image", value: initialInfo.image });
            dispatch({ type: "set", key: "isDisabled", value: initialInfo.isDisabled });
        }

        if (onUpdate != null) onUpdate();
    };

    // id edit form, load data
    React.useEffect(() => {
        const loadSubCategory = async () => {
            const subCategoryResult = await getServerData(`query { subCategory(id: ${id}) { name nameTranslated categoryId image isDisabled } }`);
            dispatch({ type: "set", key: "name", value: subCategoryResult.data.subCategory.name });
            dispatch({ type: "set", key: "nameTranslated", value: subCategoryResult.data.subCategory.nameTranslated });
            dispatch({ type: "set", key: "categoryId", value: subCategoryResult.data.subCategory.categoryId });
            dispatch({ type: "set", key: "image", value: subCategoryResult.data.subCategory.image });
            dispatch({ type: "set", key: "isDisabled", value: subCategoryResult.data.subCategory.isDisabled });
        };

        const loadCategories = async () => {
            const categoriesResult = await getServerData(`query { categories { id name }}`);
            setCategories(categoriesResult.data.categories);
            if (categoryId != null)
                dispatch({ type: "set", key: "categoryId", value: categoryId });
        };

        if (id !== undefined) loadSubCategory();
        loadCategories();
    }, [id, categoryId]);

    // render component
    return (
        <ContentForm id={id} name="subCategory" title="Create new subCategory" command={subCategoryCommand} commandDisabled={info.name === ""} onUpdate={() => action()}>
            <div className="column-double">
                <ImageUpload uploadUrl="/upload-category" formName="category" value={info.image as string} onChange={url => dispatch({ type: "set", key: "image", value: url })} />
                <div>
                    <Select labelId="role-label" variant="outlined" label="Category" defaultValue={info.categoryId} value={info.categoryId} onChange={e => dispatch({ type: "set", key: "categoryId", value: e.target.value })}>
                        {
                            categories.map(category => <MenuItem key={category.id} value={category.id} selected={category.id === categoryId}>{category.name}</MenuItem>)
                        }
                    </Select>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="SubCategory name" value={info.name} onChange={e => dispatch({ type: "set", key: "name", value: e.target.value })} />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="SubCategory name (Arabic)" value={info.nameTranslated} onChange={e => dispatch({ type: "set", key: "nameTranslated", value: e.target.value })} />
                    </FormControl>
                </div>
            </div>
            {id !== undefined && (
                <FormControl fullWidth margin="normal">
                    <Switch onChange={(e) => dispatch({ type: "set", key: "isDisabled", value: e.target.checked })} checked={info.isDisabled as boolean} />
                </FormControl>
            )}
        </ContentForm>
    )
}

export default SubCategory;