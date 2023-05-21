import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Switch, TextField, Select } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import { HourglassBottom } from "@mui/icons-material";

const initialInfo = {
    categoryId: 1,
    name: "",
    model: "",
    image: "",
    description: "",
    price: 0,
    isDisabled: false
};

interface IProductProps {
    id?: number
    onUpdate?: () => void
}

interface ICategory {
    id: number
    name: string
}

const Product: FunctionComponent<IProductProps> = ({ id, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);
    const [categories, setCategories] = React.useState<ICategory[]>([]);
    const [isUpload, setIsUpload] = React.useState(false);

    // process form type (create or update)
    const productCommand = id === undefined ?
        `mutation { createProduct(input: {categoryId: ${info.categoryId}, name: "${(info.name as string).trim()}", model: "${(info.model as string).trim()}", image: "${info.image}", description: "${(info.description as string).replaceAll("\n", "\\n")}", price: ${info.price}}) { id name model } }` :
        `mutation { updateProduct(id: ${id}, input: {categoryId: ${info.categoryId}, name: "${(info.name as string).trim()}", model: "${(info.model as string).trim()}", image: "${info.image}", description: "${(info.description as string).replaceAll("\n", "\\n")}", price: ${info.price}, isDisabled: ${info.isDisabled}}) { id name model } }`;

    // load data function
    const action = async () => {
        if (id !== undefined) {
            const result = await getServerData(`query { product(id: ${id}) {id category { id } name model image description price isDisabled} }`);
            dispatch({ type: "set", key: "name", value: result.data.product.name });
            dispatch({ type: "set", key: "categoryId", value: result.data.product.category.id });
            dispatch({ type: "set", key: "model", value: result.data.product.model });
            dispatch({ type: "set", key: "image", value: result.data.product.image });
            dispatch({ type: "set", key: "description", value: result.data.product.description });
            dispatch({ type: "set", key: "price", value: result.data.product.price });
            dispatch({ type: "set", key: "isDisabled", value: result.data.product.isDisabled });
        } else {
            dispatch({ type: "set", key: "name", value: initialInfo.name });
            dispatch({ type: "set", key: "categoryId", value: initialInfo.categoryId });
            dispatch({ type: "set", key: "model", value: initialInfo.model });
            dispatch({ type: "set", key: "image", value: initialInfo.image });
            dispatch({ type: "set", key: "description", value: initialInfo.description });
            dispatch({ type: "set", key: "price", value: initialInfo.price });
            dispatch({ type: "set", key: "isDisabled", value: initialInfo.isDisabled });
        }

        if (onUpdate != null) onUpdate();
    };

    // handle file upload
    const handleUploadImage = (image: File) => {
        setIsUpload(true);
        const action = async () => {
            try {

                const formData = new FormData();
                formData.append("product", image);
                const response = await fetch(data["site-url"] + "/upload-product", {
                    method: "POST",
                    body: formData
                });
                const result = await response.json();
                if (result.success) dispatch({ type: "set", key: "image", value: "/" + result.message });
            } catch (ex) {
                console.log(ex);
            }
            
            setIsUpload(false);
        };
        action();
    };

    // id edit form, load data
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { product(id: ${id}) {id category { id } name model image description price isDisabled} }`);
            dispatch({ type: "set", key: "categoryId", value: result.data.product.category.id });
            dispatch({ type: "set", key: "name", value: result.data.product.name });
            dispatch({ type: "set", key: "model", value: result.data.product.model });
            dispatch({ type: "set", key: "image", value: result.data.product.image });
            dispatch({ type: "set", key: "description", value: result.data.product.description });
            dispatch({ type: "set", key: "price", value: result.data.product.price });
            dispatch({ type: "set", key: "isDisabled", value: result.data.product.isDisabled });
        };
        if (id !== undefined) action();
    }, [id]);

    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { categories { id name } }`);
            setCategories(result.data.categories);
        };
        action();
    }, [])

    // render component
    return (
        <ContentForm id={id} name="product" title="Create new product" command={productCommand} commandDisabled={info.name === "" || info.model === ""} onUpdate={() => action()}>
            <div className="column-double">
                <div>
                    <img className="side-image side-image--product" src={data["site-url"] + info.image as string} alt="product" />
                    <input id="file-upload" accept="image/*" type="file" hidden={true} onChange={(e) => handleUploadImage(e.target.files![0])} />
                    <label htmlFor="file-upload" className="button button--large">Upload { isUpload && <HourglassBottom />}</label>
                </div>
                <div>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="Product name" value={info.name} onChange={e => dispatch({ type: "set", key: "name", value: e.target.value })} />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="Product model" value={info.model} onChange={e => dispatch({ type: "set", key: "model", value: e.target.value })} />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Category</InputLabel>
                        <Select labelId="role-label" variant="outlined" label="Category" defaultValue={info.categoryId} value={info.categoryId} onChange={e => dispatch({ type: "set", key: "categoryId", value: e.target.value })}>
                            {
                                categories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" type="number" label="Price" value={info.price} onChange={e => dispatch({ type: "set", key: "price", value: e.target.value })} />
                    </FormControl>
                </div>
            </div>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" multiline={true} rows={5} label="Description" value={info.description} onChange={e => dispatch({ type: "set", key: "description", value: e.target.value })} />
            </FormControl>
            {id !== undefined && (
                <FormControl fullWidth margin="normal">
                    <Switch onChange={(e) => dispatch({ type: "set", key: "isDisabled", value: e.target.checked })} checked={info.isDisabled as boolean} />
                </FormControl>
            )}
        </ContentForm>
    )
}

export default Product;