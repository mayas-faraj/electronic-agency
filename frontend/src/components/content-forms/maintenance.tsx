import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, TextField, Select, Button, Modal } from "@mui/material";
import { Handyman, LocalOffer, PermContactCalendar, PersonPinCircle } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ProductView from "../views/product";
import RepairForm from "../content-forms/repair";
import getServerData from "../../libs/server-data";

const initialInfo = {
    id: 0,
    description: "",
    propertyType: "",
    address: "",
    longitude: 0,
    latitude: 0,
    bookedAt: "",
    status: "",
    repairId: 0,
    productId: 0,
    productSn: "",
    clientId: 0,
};

interface IMaintenanceProps {
    id: number
    onUpdate?: () => void
}

const statuses = ["PENDING", "CANCELED", "FIXED", "NOTFIXED"];

const Maintenance: FunctionComponent<IMaintenanceProps> = ({ id, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // component status
    const [viewClient, setViewClient] = React.useState(false);
    const [viewProduct, setViewProduct] = React.useState(false);
    const [viewRepair, setViewRepair] = React.useState(false);

    // process form type (create or update)
    const maintenanceCommand = `mutation { updateMaintenanceStatus(id: ${id}, status: "${info.status}") { id status } }`;

    // load data function
    const action = async () => {
        const result = await getServerData(`query { maintenance(id: ${id}) { id longitude latitude address description status propertyType bookedAt productItem { sn product { id } client { clientId } } repair { id } } }`);
        dispatch({ type: "set", key: "id", value: result.data.maintenance.id });
        dispatch({ type: "set", key: "longitude", value: result.data.maintenance.longitude });
        dispatch({ type: "set", key: "latitude", value: result.data.maintenance.longitude });
        dispatch({ type: "set", key: "address", value: result.data.maintenance.address });
        dispatch({ type: "set", key: "description", value: result.data.maintenance.description });
        dispatch({ type: "set", key: "status", value: result.data.maintenance.status });
        dispatch({ type: "set", key: "propertyType", value: result.data.maintenance.propertyType });
        dispatch({ type: "set", key: "bookedAt", value: result.data.maintenance.bookedAt });
        dispatch({ type: "set", key: "productId", value: result.data.maintenance.productItem.product?.id });
        dispatch({ type: "set", key: "productSn", value: result.data.maintenance.productItem.sn });
        dispatch({ type: "set", key: "clientId", value: result.data.maintenance.productItem.client.clientId });
        dispatch({ type: "set", key: "repairId", value: result.data.maintenance.repair?.id ?? 0 });
        if (onUpdate != null) onUpdate();
    };

    // on load
    React.useEffect(() => {
        const loadMaintenance = async () => {
            const result = await getServerData(`query { maintenance(id: ${id}) { id longitude latitude address description status propertyType bookedAt productItem { sn product { id } client { clientId } } repair { id } } }`);
            dispatch({ type: "set", key: "id", value: result.data.maintenance.id });
            dispatch({ type: "set", key: "longitude", value: result.data.maintenance.longitude });
            dispatch({ type: "set", key: "latitude", value: result.data.maintenance.longitude });
            dispatch({ type: "set", key: "address", value: result.data.maintenance.address });
            dispatch({ type: "set", key: "description", value: result.data.maintenance.description });
            dispatch({ type: "set", key: "status", value: result.data.maintenance.status });
            dispatch({ type: "set", key: "propertyType", value: result.data.maintenance.propertyType });
            dispatch({ type: "set", key: "bookedAt", value: result.data.maintenance.bookedAt });
            dispatch({ type: "set", key: "productId", value: result.data.maintenance.productItem.product?.id });
            dispatch({ type: "set", key: "productSn", value: result.data.maintenance.productItem.sn });
            dispatch({ type: "set", key: "clientId", value: result.data.maintenance.productItem.client.clientId });
            dispatch({ type: "set", key: "repairId", value: result.data.maintenance.repair?.id ?? 0 });
        };
        loadMaintenance();
    }, [id]);

    // render component
    return (
        <ContentForm id={id} name="maintenance" title="Maintenance Info" command={maintenanceCommand} onUpdate={() => action()}>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" InputProps={{ readOnly: true }} multiline={true} rows={5} label="Address" value={info.address} />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField variant="outlined" InputProps={{ readOnly: true }} multiline={true} rows={5} label="description" value={info.description} />
            </FormControl>
            <div className="column-double">
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" InputProps={{ readOnly: true }} label="property Type" value={info.propertyType} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" InputProps={{ readOnly: true }} label="Booked At" value={new Date(Number(info.bookedAt)).toLocaleString()} />
                </FormControl>
            </div>
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Status</InputLabel>
                <Select labelId="role-label" variant="outlined" label="Status" defaultValue={info.status} value={info.status} onChange={e => dispatch({ type: "set", key: "status", value: e.target.value })} >
                    {statuses.map(status => (<MenuItem key={status} value={status}>{status.toLowerCase()}</MenuItem>))}
                </Select>
            </FormControl>
            <div className="row-flex">
                {(info.longitude && info.latitude) && <Button variant="contained" color="primary" target="_blank" href={`https://maps.google.com/?q=${info.latitude},${info.longitude}`}><PersonPinCircle /> View Location</Button>}
                <Button variant="contained" color="primary" onClick={() => setViewProduct(true)}><LocalOffer /> Product Info</Button>
                <Button variant="contained" color="primary" onClick={() => setViewClient(true)}><PermContactCalendar /> User Info</Button>
                <Button variant="contained" color="primary" onClick={() => setViewRepair(true)}><Handyman />{info.repairId === 0 ? "Create" : "Update"} Repair</Button>
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
            <Modal open={viewRepair} onClose={() => setViewRepair(false)} >
                <div className="modal">
                    <RepairForm maintenanceId={id} id={info.repairId === 0 ? undefined : Number(info.repairId)} onUpdate={ action } />
                </div>
            </Modal>
        </ContentForm>
    )
}

export default Maintenance;