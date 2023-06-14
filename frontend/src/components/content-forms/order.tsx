import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, TextField, Select, Button, Modal } from "@mui/material";
import { WorkspacePremium, PermContactCalendar, LocalOffer, Send } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ProductView from "../views/product";
import OfferForm from "../content-forms/offer";
import getServerData from "../../libs/server-data";

const initialInfo = {
    id: 0,
    count: 0,
    totalPrice: 0,
    address: "",
    note: "",
    status: "",
    isOfferRequest: false,
    offerId: 0,
    productId: 0,
    clientId: 0,
    email: ""
};

interface IOrderProps {
    id: number
    onUpdate?: () => void
}

const statuses = ["PENDING", "REJECTED", "ACCEPTED", "CLOSED"];

const Order: FunctionComponent<IOrderProps> = ({ id, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // component status
    const [viewClient, setViewClient] = React.useState(false);
    const [viewProduct, setViewProduct] = React.useState(false);
    const [viewOffer, setViewOffer] = React.useState(false);

    // process form type (create or update)
    const orderCommand = `mutation { updateOrderStatus(id: ${id}, status: "${info.status}") { id status } }`;

    // load data function
    const action = async () => {
        const result = await getServerData(`query { order(id: ${id}) { id count totalPrice address note status isOfferRequest createdAt product { id } client { id email } offer { id } } }`);
        dispatch({ type: "set", key: "id", value: result.data.order.id });
        dispatch({ type: "set", key: "count", value: result.data.order.count });
        dispatch({ type: "set", key: "totalPrice", value: result.data.order.totalPrice });
        dispatch({ type: "set", key: "address", value: result.data.order.address });
        dispatch({ type: "set", key: "note", value: result.data.order.note });
        dispatch({ type: "set", key: "status", value: result.data.order.status });
        dispatch({ type: "set", key: "isOfferRequest", value: result.data.order.isOfferRequest });
        dispatch({ type: "set", key: "productId", value: result.data.order.product.id });
        dispatch({ type: "set", key: "email", value: result.data.order.client.email });
        dispatch({ type: "set", key: "clientId", value: result.data.order.client.id });
        dispatch({ type: "set", key: "offerId", value: result.data.order.offer?.id ?? 0 });
        if (onUpdate != null) onUpdate();
    };

    // on load
    React.useEffect(() => {
        const loadOrder = async () => {
            const result = await getServerData(`query { order(id: ${id}) { id count totalPrice address note status isOfferRequest createdAt product { id } client { id email } offer { id } } }`);
            dispatch({ type: "set", key: "id", value: result.data.order.id });
            dispatch({ type: "set", key: "count", value: result.data.order.count });
            dispatch({ type: "set", key: "totalPrice", value: result.data.order.totalPrice });
            dispatch({ type: "set", key: "address", value: result.data.order.address });
            dispatch({ type: "set", key: "note", value: result.data.order.note });
            dispatch({ type: "set", key: "status", value: result.data.order.status });
            dispatch({ type: "set", key: "isOfferRequest", value: result.data.order.isOfferRequest });
            dispatch({ type: "set", key: "productId", value: result.data.order.product.id });
            dispatch({ type: "set", key: "email", value: result.data.order.client.email });
            dispatch({ type: "set", key: "clientId", value: result.data.order.client.id });
            dispatch({ type: "set", key: "offerId", value: result.data.order.offer?.id ?? 0 });
        };
        loadOrder();
    }, [id]);

    // render component
    return (
        <ContentForm id={id} name="order" title="Order Info" command={orderCommand} onUpdate={() => action()}>
            <h2 className="subtitle">Order :{info.id.toString()}</h2>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" InputProps={{ readOnly: true }} multiline={true} rows={5} label="Client Address" value={info.address} />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" InputProps={{ readOnly: true }} multiline={true} rows={5} label="Client Note" value={info.note} />
            </FormControl>
            <div className="column-double">
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" InputProps={{ readOnly: true }} label="Count" value={info.count} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" InputProps={{ readOnly: true }} label="Total price" value={info.isOfferRequest ? "Offer Request" : info.totalPrice} />
                </FormControl>
            </div>
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Status</InputLabel>
                <Select labelId="role-label" variant="outlined" label="Status" defaultValue={info.status} value={info.status} onChange={e => dispatch({ type: "set", key: "status", value: e.target.value })} >
                    {statuses.map(status => (<MenuItem key={status} value={status}>{status.toLowerCase()}</MenuItem>))}
                </Select>
            </FormControl>
            <div className="row-flex">
                <Button variant="contained" color="primary" onClick={() => setViewProduct(true)}><LocalOffer /> Product Info</Button>
                <Button variant="contained" color="primary" onClick={() => setViewClient(true)}><PermContactCalendar /> User Info</Button>
                <Button variant="contained" color="primary" onClick={() => setViewOffer(true)}><WorkspacePremium />{info.offerId === 0 ? "Create" : "Update"} Offer</Button>
                {info.email !== "" && <Button variant="contained" color="primary" href={`mailto:${info.email}?subject=Offer for you from Alardh-Alsalba&body=We create a special offer for you`}><Send /> Send Email</Button>}
            </div>
            <Modal open={viewClient} onClose={() => setViewClient(false)} >
                <div className="modal">
                    <ClientView id={Number(info.clientId)} />
                </div>
            </Modal>
            <Modal open={viewProduct} onClose={() => setViewProduct(false)} >
                <div className="modal">
                    <ProductView id={Number(info.productId)} />
                </div>
            </Modal>
            <Modal open={viewOffer} onClose={() => setViewOffer(false)} >
                <div className="modal">
                    <OfferForm orderId={id} id={info.offerId === 0 ? undefined : Number(info.offerId)} onUpdate={ action } />
                </div>
            </Modal>
        </ContentForm>
    )
}

export default Order;