import React, { FunctionComponent } from "react";
import { FormControl, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";

const initialInfo = {
    discount: 0,
    isDiscountPercent: false,
    validationDays: 0,
    createdAt: ""
};

interface IOfferProps {
    id?: number
    orderId: number
    onUpdate?: () => void
}

const Offer: FunctionComponent<IOfferProps> = ({ id, orderId, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // process form type (create or update)
    const offerCommand = id === undefined ?
        `mutation { createOfferByAuth(input: {orderId: ${orderId}, discount: ${info.discount}, isDiscountPercent: ${info.isDiscountPercent}, validationDays: ${info.validationDays}}) { id createdAt } }` :
        `mutation { updateOfferByAuth(id: ${id}, input: {discount: ${info.discount}, isDiscountPercent: ${info.isDiscountPercent}, validationDays: ${info.validationDays}}) {id createdAt}}`;

    // on load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { order(id: ${orderId}) { offer { validationDays discount isDiscountPercent createdAt } } }`);
            dispatch({ type: "set", key: "discount", value: result.data.order.offer.discount });
            dispatch({ type: "set", key: "isDiscountPercent", value: result.data.order.offer.isDiscountPercent });
            dispatch({ type: "set", key: "validationDays", value: result.data.order.offer.validationDays });
            dispatch({ type: "set", key: "createdAt", value: result.data.order.offer.createdAt });
        };
        if (id !== undefined) action();
    }, [id, orderId]);

    // render component
    return (
        <ContentForm id={id} name="offer" title="Offer Info" command={offerCommand} onUpdate={onUpdate}>
            {id !== undefined && (
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" InputProps={{ readOnly: true }} label="Offer Date" value={new Date(Number(info.createdAt)).toLocaleString()} />
                </FormControl>
            )}
            <div className="column-double">
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="Price" value={info.discount} onChange={e => dispatch({ type: "set", key: "discount", value: e.target.value })} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="validationDays" value={info.validationDays} onChange={e => dispatch({ type: "set", key: "validationDays", value: e.target.value })} />
                </FormControl>
            </div>
            {id !== undefined && (
                    <Management onUpdate={onUpdate} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} className="button-wide-wrapper" command={`mutation { deleteOffer(id: ${id})  { id createdAt }}`} />
            )}
        </ContentForm>
    )
}

export default Offer;