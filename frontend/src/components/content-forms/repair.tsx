import React, { FunctionComponent } from "react";
import { FormControl, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";

const initialInfo = {
    price: 0,
    description: "",
    createdAt: ""
};

interface IRepairProps {
    id?: number
    maintenanceId: number
    onUpdate?: () => void
}

const Repair: FunctionComponent<IRepairProps> = ({ id, maintenanceId, onUpdate }) => {
    // component reducer
    const [info, dispatch] = React.useReducer(reducer, initialInfo);

    // process form type (create or update)
    const repairCommand = id === undefined ?
        `mutation { createRepairByAuth(input: {maintenanceId: ${maintenanceId}, price: ${info.price}, description: "${info.description}"}) { id createdAt } }` :
        `mutation { updateRepairByAuth(id: ${id}, input: {price: ${info.price}, description: "${info.description}"}) {id createdAt}}`;

    // on load
    React.useEffect(() => {
        const action = async () => {
            const result = await getServerData(`query { maintenance(id: ${maintenanceId}) { repair { description price createdAt } } }`);
            dispatch({ type: "set", key: "price", value: result.data.maintenance.repair.price });
            dispatch({ type: "set", key: "description", value: result.data.maintenance.repair.description });
            dispatch({ type: "set", key: "createdAt", value: result.data.maintenance.repair.createdAt });
        };
        if (id !== undefined) action();
    }, [id, maintenanceId]);

    // render component
    return (
        <ContentForm id={id} name="repair" title="Repair Info" command={repairCommand} onUpdate={onUpdate}>
            {id !== undefined && (
                <FormControl fullWidth margin="normal">
                    <TextField variant="outlined" InputProps={{ readOnly: true }} label="Repair Date" value={new Date(Number(info.createdAt)).toLocaleString()} />
                </FormControl>
            )}
            <div className="column-double">
                <FormControl fullWidth margin="normal">
                    <TextField type="number" label="Price" value={info.price} onChange={e => dispatch({ type: "set", key: "price", value: e.target.value })} />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField label="description" value={info.description} onChange={e => dispatch({ type: "set", key: "description", value: e.target.value })} />
                </FormControl>
            </div>
            {id !== undefined && (
                    <Management onUpdate={onUpdate} type={ManagementType.button} hasConfirmModal={true} operation={Operation.delete} className="button-wide-wrapper" command={`mutation { deleteRepair(id: ${id})  { id createdAt }}`} />
            )}
        </ContentForm>
    )
}

export default Repair;