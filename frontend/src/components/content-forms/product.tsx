import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Switch, TextField, Select, SelectChangeEvent } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import ImageUpload from "../image-upload";

const initialInfo = {
    subCategoryId: 0,
    categoryId: 0,
    name: "",
    nameTranslated: "",
    model: "",
    image: "",
    description: "",
    descriptionTranslated: "",
    specification: "",
    specificationTranslated: "",
    price: "",
    catalogFile: "",
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
    const [subCategories, setSubCategories] = React.useState<ICategory[]>([]);

    // process form type (create or update)
    const productCommand = id === undefined ?
        `mutation { createProduct(input: {subCategoryId: ${info.subCategoryId}, name: "${(info.name as string).trim()}", nameTranslated: "${(info.nameTranslated as string).trim()}", model: "${(info.model as string).trim()}", image: "${info.image}", description: "${(info.description as string).replaceAll("\n", "\\n")}", descriptionTranslated: "${(info.descriptionTranslated as string).trim()}", price: ${info.price !== "" ? info.price : null}, catalogFile: "${info.catalogFile}"}) { id name model } }` :
        `mutation { updateProduct(id: ${id}, input: {subCategoryId: ${info.subCategoryId}, name: "${(info.name as string).trim()}", nameTranslated: "${(info.nameTranslated as string).trim()}", model: "${(info.model as string).trim()}", image: "${info.image}", description: "${(info.description as string).replaceAll("\n", "\\n")}", descriptionTranslated: "${(info.descriptionTranslated as string).trim()}", price: ${info.price !== "" ? info.price : null}, catalogFile: "${info.catalogFile}", isDisabled: ${info.isDisabled}}) { id name model } }`;

    // load data function
    const action = async () => {
        if (id !== undefined) {
            const result = await getServerData(`query { product(id: ${id}) {id subCategory { id categoryId } name nameTranslated model image description descriptionTranslated price isDisabled} }`);
            dispatch({ type: "set", key: "name", value: result.data.product.name });
            dispatch({ type: "set", key: "nameTranslated", value: result.data.product.nameTranslated });
            dispatch({ type: "set", key: "categoryId", value: result.data.product.subCategory.categoryId });
            dispatch({ type: "set", key: "subCategoryId", value: result.data.product.subCategory.id });
            dispatch({ type: "set", key: "model", value: result.data.product.model });
            dispatch({ type: "set", key: "image", value: result.data.product.image });
            dispatch({ type: "set", key: "description", value: result.data.product.description });
            dispatch({ type: "set", key: "descriptionTranslated", value: result.data.product.descriptionTranslated });
            dispatch({ type: "set", key: "specification", value: result.data.product.specification });
            dispatch({ type: "set", key: "specificationTranslated", value: result.data.product.specificationTranslated });
            dispatch({ type: "set", key: "price", value: result.data.product.price });
            dispatch({ type: "set", key: "catalogFile", value: result.data.product.catalogFile });
            dispatch({ type: "set", key: "isDisabled", value: result.data.product.isDisabled });
        } else {
            dispatch({ type: "set", key: "name", value: initialInfo.name });
            dispatch({ type: "set", key: "nameTranslated", value: initialInfo.nameTranslated });
            dispatch({ type: "set", key: "categoryId", value: initialInfo.categoryId });
            dispatch({ type: "set", key: "subCategoryId", value: initialInfo.subCategoryId });
            dispatch({ type: "set", key: "model", value: initialInfo.model });
            dispatch({ type: "set", key: "image", value: initialInfo.image });
            dispatch({ type: "set", key: "description", value: initialInfo.description });
            dispatch({ type: "set", key: "descriptionTranslated", value: initialInfo.descriptionTranslated });
            dispatch({ type: "set", key: "specification", value: initialInfo.specification });
            dispatch({ type: "set", key: "specificationTranslated", value: initialInfo.specificationTranslated });
            dispatch({ type: "set", key: "price", value: initialInfo.price });
            dispatch({ type: "set", key: "catalogFile", value: initialInfo.catalogFile });
            dispatch({ type: "set", key: "isDisabled", value: initialInfo.isDisabled });
        }

        if (onUpdate != null) onUpdate();
    };

    // load subcategories
    const loadSubcategories = async (categoryId: number) => {
        dispatch({ type: "set", key: "categoryId", value: categoryId.toString()});
        console.log('changing to: '+ categoryId);
        const subCategoriesResult = await getServerData(`query { subCategories (categoryId: ${categoryId}) { id name } }`);
        setSubCategories(subCategoriesResult.data.subCategories);
    }

    // on load
    React.useEffect(() => {
        // in edit, load product data
        const loadProduct = async () => {
            const result = await getServerData(`query { product(id: ${id}) {id subCategory { id categoryId } name nameTranslated model image description descriptionTranslated specification specificationTranslated price catalogFile isDisabled} }`);
            dispatch({ type: "set", key: "categoryId", value: result.data.product.subCategory.categoryId });
            dispatch({ type: "set", key: "subCategoryId", value: result.data.product.subCategory.id });
            dispatch({ type: "set", key: "name", value: result.data.product.name });
            dispatch({ type: "set", key: "nameTranslated", value: result.data.product.nameTranslated });
            dispatch({ type: "set", key: "model", value: result.data.product.model });
            dispatch({ type: "set", key: "image", value: result.data.product.image });
            dispatch({ type: "set", key: "description", value: result.data.product.description });
            dispatch({ type: "set", key: "descriptionTranslated", value: result.data.product.descriptionTranslated });
            dispatch({ type: "set", key: "specification", value: result.data.product.specification });
            dispatch({ type: "set", key: "specificationTranslated", value: result.data.product.specificationTranslated });
            dispatch({ type: "set", key: "price", value: result.data.product.price });
            dispatch({ type: "set", key: "catalogFile", value: result.data.product.catalogFile });
            dispatch({ type: "set", key: "isDisabled", value: result.data.product.isDisabled });
        };
        if (id !== undefined) loadProduct();

        // load categories
        const loadCategories = async () => {
            const categoriesResult = await getServerData(`query { categories { id name } }`);
            setCategories(categoriesResult.data.categories);
        };

        loadCategories();
    }, [id]);


    React.useEffect(() => {
        loadSubcategories(parseInt(String(info.categoryId)));
    }, [info.categoryId]);

    // event handlers
    const handleCategoryChange = async (e: SelectChangeEvent<string | number | boolean | Date>) => {
        const categoryId = parseInt(String(e.target.value));
        loadSubcategories(categoryId);
    };

    // render component
    return (
        <ContentForm id={id} name="product" title="Create new product" command={productCommand} commandDisabled={info.name === "" || info.nameTranslated === "" || info.model === "" || info.subCategoryId === 0} onUpdate={() => action()}>
            <div className="column-double">
                <ImageUpload uploadUrl="/upload-product" formName="product" value={info.image as string} onChange={url => dispatch({ type: "set", key: "image", value: url })} />
                <div>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="Product name" value={info.name} onChange={e => dispatch({ type: "set", key: "name", value: e.target.value })} />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="Product name (Arabic)" value={info.nameTranslated} onChange={e => dispatch({ type: "set", key: "nameTranslated", value: e.target.value })} />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" label="Product model" value={info.model} onChange={e => dispatch({ type: "set", key: "model", value: e.target.value })} />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField variant="outlined" type="number" label="Price" value={info.price != null ? info.price : ""} onChange={e => dispatch({ type: "set", key: "price", value: e.target.value })} />
                    </FormControl>
                </div>
            </div>
            <div className="column-double">
                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Category</InputLabel>
                    <Select labelId="role-label" variant="outlined" label="Category" value={info.categoryId} onChange={e => handleCategoryChange(e)}>
                        {
                            categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Sub-category</InputLabel>
                    <Select labelId="role-label" variant="outlined" label="Sub-Category" value={info.subCategoryId} onChange={e => dispatch({ type: "set", key: "subCategoryId", value: e.target.value })}>
                        {
                            subCategories.map(subCategory => (
                                <MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" multiline={true} rows={5} label="Description" value={info.description != null ? info.description : ""} onChange={e => dispatch({ type: "set", key: "description", value: e.target.value })} />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" multiline={true} rows={5} label="Description (Arabic)" value={info.descriptionTranslated != null ? info.descriptionTranslated : ""} onChange={e => dispatch({ type: "set", key: "descriptionTranslated", value: e.target.value })} />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" multiline={true} rows={5} label="Specification" value={info.specification != null ? info.specification : ""} onChange={e => dispatch({ type: "set", key: "specification", value: e.target.value })} />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" multiline={true} rows={5} label="Specification (Arabic)" value={info.specificationTranslated != null ? info.specificationTranslated : ""} onChange={e => dispatch({ type: "set", key: "specificationTranslated", value: e.target.value })} />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="Catalog URL" value={info.catalogFile != null ? info.catalogFile : ""} onChange={e => dispatch({ type: "set", key: "catalogFile", value: e.target.value })} />
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