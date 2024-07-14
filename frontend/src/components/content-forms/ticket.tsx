import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, TextField, Select, Button, Modal } from "@mui/material";
import { PermContactCalendar } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ClientSelect from "../content-tables/clients";
import getServerData from "../../libs/server-data";

const initialInfo = {
  address: "",
  title: "",
  description: "",
  priority: "NORMAL",
  asset: "",
  status: "",
  clientId: 0,
  clientEmail: "",
  clientPhone: "",
  center: "",
  createdAt: ""
};

type TicketProduct = {
  product: {
    id: number;
    name: string;
    model: string;
    image: string;
  };
  count: number;
  price: number;
};

interface ITicketProps {
  id?: number;
  onUpdate?: () => void;
}

type Center = {
  id: number;
  name: string;
  admins: {
    user: string;
  }[];
};

const statuses = ["NEW", "OPEN", "PENDING", "CLOSED", "COMPLETED", "REOPEN"];
const priorities = ["CRITICAL", "HIGH", "NORMAL", "LOW"];

const Ticket: FunctionComponent<ITicketProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [centers, setCenters] = React.useState<Center[]>([]);

  // process form type (create or update)
  const ticketCommand =
    id !== undefined
      ? `mutation { updateTicketStatus(id: ${id}, status: "${info.status}", priority: "${info.priority}) { id status } }`
      : `mutation { createTicket(input: {serviceId: 1, description: "${info.description}", title: "${info.title}", user: "${info.clientPhone}", asset: "${info.asset}"}) { id status } }`;

  const handleSelectClient = (clientId: number, clientEmail: string, clientPhone: string) => {
    dispatch({ type: "set", key: "clientId", value: clientId });
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: clientPhone });
    setSelectClient(false);
  };

  const handleSave = async (result: any) => {
    dispatch({ type: "set", key: "clientId", value: initialInfo.clientId });
    dispatch({ type: "set", key: "clientPhone", value: initialInfo.clientPhone });
    dispatch({ type: "set", key: "clientEmail", value: initialInfo.clientEmail });
    dispatch({ type: "set", key: "createdAt", value: initialInfo.createdAt });
    dispatch({ type: "set", key: "address", value: initialInfo.address });
    dispatch({ type: "set", key: "description", value: initialInfo.description });
    dispatch({ type: "set", key: "title", value: initialInfo.title });
    dispatch({ type: "set", key: "priority", value: initialInfo.priority });
    dispatch({ type: "set", key: "asset", value: initialInfo.asset });
    dispatch({ type: "set", key: "status", value: initialInfo.status });
    dispatch({ type: "set", key: "center", value: initialInfo.center });

    if (result?.data?.createTicket?.id != null) {
      await getServerData(
        `mutation { ${centers
          .filter((center) => center.name === info.center)[0]
          .admins.map(
            (admin, i) =>
              `createTicketAssignment${i}: createTicketAssignment(ticketId: ${result.data.createTicket.id}, assignTo: "${admin.user}") { id }`
          )
          .join(" ")} }`,
        true
      );
    }
    if (onUpdate !== undefined) onUpdate();
  };

  // on load
  React.useEffect(() => {
    const loadTicket = async () => {
      const result = await getServerData(
        `query { ticket(id: ${id}) { id title description status title asset priority createdAt } }`
      , true);

      dispatch({ type: "set", key: "createdAt", value: result.data.ticket.createdAt });
      dispatch({ type: "set", key: "title", value: result.data.ticket.title });
      dispatch({ type: "set", key: "description", value: result.data.ticket.description });
      dispatch({ type: "set", key: "priority", value: result.data.ticket.priority });
      dispatch({ type: "set", key: "asset", value: result.data.ticket.asset });
      dispatch({ type: "set", key: "status", value: result.data.ticket.status });
    };
    if (id !== undefined) loadTicket();
  }, [id]);

  React.useEffect(() => {
    const action = async () => {
      const centersResponse = await getServerData(`query { centers(parentId: null) { id name admins { user } } }`);
      setCenters(centersResponse.data.centers);
    };
    action();
  }, []);

  // render component
  return (
    <ContentForm
      id={id}
      name="ticket"
      title="Ticket Info"
      command={ticketCommand}
      isService={true}
      onUpdate={(result) => handleSave(result)}
      commandDisabled={id === undefined && (info.clientId === 0 || info.asset === "" || info.center === "")}
    >
      {id !== undefined && <h2 className="subtitle">Ticket :{id.toString()}</h2>}
      <div className="column-double">
        {id === undefined && (
          <Button fullWidth variant="contained" color="primary" onClick={() => setSelectClient(true)}>
            <PermContactCalendar />
            {info.clientPhone === "" ? "Select Client" : `Update Client: ${info.clientPhone} [${info.clientEmail}]`}
          </Button>
        )}
        {id !== undefined && (
          <Button fullWidth variant="contained" color="primary" onClick={() => setViewClient(true)}>
            <PermContactCalendar />
            {info.clientPhone as string}
          </Button>
        )}
        <TextField
          variant="outlined"
          InputProps={{ readOnly: id !== undefined }}
          label="Client Address"
          value={info.address}
          onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value })}
        />
      </div>
      <div className="column-double">
        <div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="product sn"
              value={info.asset}
              InputProps={{ readOnly: id !== undefined }}
              onChange={(e) => dispatch({ type: "set", key: "asset", value: e.target.value })}
            />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel id="center-label">Centers</InputLabel>
            <Select
              labelId="center-label"
              variant="outlined"
              label="Priority"
              defaultValue={info.center}
              value={info.center}
              onChange={(e) => dispatch({ type: "set", key: "center", value: e.target.value })}
            >
              {centers.map((center) => (
                <MenuItem key={center.id} value={center.name} disabled={center.admins.length === 0}>
                  {center.name} {center.admins.length === 0 ? "<no users>" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Problem summary"
          value={info.title}
          InputProps={{ readOnly: id !== undefined }}
          onChange={(e) => dispatch({ type: "set", key: "title", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          InputProps={{ readOnly: id !== undefined }}
          multiline={true}
          rows={5}
          label="Problem description"
          value={info.description}
          onChange={(e) => dispatch({ type: "set", key: "description", value: e.target.value })}
        />
      </FormControl>
      {id !== undefined && (
        <div className="column-double">
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              variant="outlined"
              label="Status"
              defaultValue={info.status}
              value={info.status}
              onChange={(e) => dispatch({ type: "set", key: "status", value: e.target.value })}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.toLowerCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              variant="outlined"
              label="Priority"
              defaultValue={info.priority}
              value={info.priority}
              onChange={(e) => dispatch({ type: "set", key: "priority", value: e.target.value })}
            >
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority.toLowerCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <Modal open={selectClient} onClose={() => setSelectClient(false)}>
        <div className="modal">
          <ClientSelect
            isSelectable={true}
            onUpdate={(clientId, clientEmail, clientPhone) => handleSelectClient(clientId, clientEmail, clientPhone)}
          />
        </div>
      </Modal>
      <Modal open={viewClient} onClose={() => setViewClient(false)}>
        <div className="modal">
          <ClientView id={Number(info.clientId)} />
        </div>
      </Modal>
    </ContentForm>
  );
};

export default Ticket;
