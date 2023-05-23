import React, { FunctionComponent } from "react";
import { FormControl, Switch, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import ImageUpload from "../image-upload";

const initialInfo = {
    name: "",
    image: "",
    isDisabled: false
};

interface ICategoryProps {
    id?: number
    onUpdate?: () => void
}

const Category: FunctionComponent<ICategoryProps> = ({ id, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // process form type (create or update)
    const categoryCommand = id === undefined ?
        `mutation { createCategory(input: { name: "${(info.name as string).trim()}", image: "${info.image}" }) { id name } }` :
        `mutation { updateCategory(id: ${id}, input: { name: "${(info.name as string).trim()}", image: "${info.image}", isDisabled: ${info.isDisabled}}) { id name } }`;

    // load data function
    const action = async () => {
        if (id !== undefined) {
            const result = await getServerData(`query { category(id: ${id}) { id name image isDisabled } }`);
            dispatch({ type: "set", key: "name", value: result.data.category.name });
            dispatch({ type: "set", key: "image", value: result.data.category.image });
            dispatch({ type: "set", key: "isDisabled", value: result.data.category.isDisabled });
        } else {
            dispatch({ type: "set", key: "name", value: initialInfo.name });
            dispatch({ type: "set", key: "image", value: initialInfo.image });
            dispatch({ type: "set", key: "isDisabled", value: initialInfo.isDisabled });
        }

        if (onUpdate != null) onUpdate();
    };

    // id edit form, load data
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { category(id: ${id}) { name image isDisabled } }`);
            dispatch({ type: "set", key: "name", value: result.data.category.name });
            dispatch({ type: "set", key: "image", value: result.data.category.image });
            dispatch({ type: "set", key: "isDisabled", value: result.data.category.isDisabled });
        };
        if (id !== undefined) action();
    }, [id]);

    // render component
    return (
        <ContentForm id={id} name="category" title="Create new category" command={categoryCommand} commandDisabled={info.name === ""} onUpdate={() => action()}>
            <div className="column-double">
                <ImageUpload uploadUrl="/upload-category" formName="category" value={info.image as string} onChange={url => dispatch({ type: "set", key: "image", value: url })} />
                <div>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="Category name" value={info.name} onChange={e => dispatch({ type: "set", key: "name", value: e.target.value })} />
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

export default Category;