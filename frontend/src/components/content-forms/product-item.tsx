import React, { FunctionComponent } from "react";
import { FormControl, TextField } from "@mui/material";
import ContentForm from "../content-form";

interface IProductProps {
    productId: number
    productItemSn?: string
    onUpdate?: () => void
}

const ProductItem: FunctionComponent<IProductProps> = ({ productId, productItemSn, onUpdate }) => {
    // component reducer
    const [sn, setSn ] = React.useState<string>("");

    // event handler
    const handleUpdate = () => {
        setSn("");
        if (onUpdate != null) onUpdate();
    }

    // process form type (create or update)
    const productCommand = (productItemSn == null || productItemSn === "") ?
        `mutation { createProductItem(productId: ${productId}, sn: "${sn}")  {sn createdAt}}` :
        `mutation { updateProductItem(sn: "${productItemSn}", newSn: "${sn}")  {sn createdAt}}`;

    // render component
    return (
        <ContentForm id={productItemSn === "" ? undefined : productItemSn} name="product sn" title="Product SN" command={productCommand} commandDisabled={sn === ""} onUpdate={ handleUpdate }>
            {(productItemSn != null && productItemSn !== "") && (
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" label="Selected SN" value={productItemSn} aria-readonly={true} />
                </FormControl>
            )}
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="New SN" value={sn} onChange={e => setSn(e.target.value)} />
            </FormControl>
        </ContentForm>
    )
}

export default ProductItem;