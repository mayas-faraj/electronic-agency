import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, TextField, Select, Button, Modal } from "@mui/material";
import { PermContactCalendar, Redeem } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ProductView from "../views/product";
import ClientSelect from "../content-tables/clients";
import getServerData from "../../libs/server-data";
import { AccessType } from "../content-tables/tickets";

const initialInfo = {
  address: "",
  title: "",
  description: "",
  priority: "NORMAL",
  asset: "",
  productId: 0,
  productName: "",
  status: "",
  clientId: 0,
  clientEmail: "",
  clientPhone: "",
  center: "",
  createdAt: "",
  createdBy: "",
  solution: ""
};

interface ITicketProps {
  id?: number;
  accessType?: AccessType;
  onUpdate?: () => void;
}

type Center = {
  id: number;
  name: string;
  admins: {
    user: string;
  }[];
};

type Admin = {
  id: number;
  user: string;
  role: string;
};

const statuses = ["NEW", "OPEN", "PENDING", "RESOLVED", "UNRESOLVED", "CLOSED", "COMPLETED", "REOPEN"];
const priorities = ["CRITICAL", "HIGH", "NORMAL", "LOW"];

const Ticket: FunctionComponent<ITicketProps> = ({ accessType, id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [viewProduct, setViewProduct] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [centers, setCenters] = React.useState<Center[]>([]);
  const [targetType, setTargetType] = React.useState("GROUP");

  // process form type (create or update)
  const ticketCommand =
    id !== undefined
      ? `mutation { updateTicket(id: ${id}, input: {status: ${targetType === "GROUP" ? "OPEN" : "PENDING"}, priority: ${
          info.priority
        }}) { id priority status } createTicketAssignment(input: {ticketId: ${id}, assignTo: "${
          info.center
        }", targetType: ${targetType}}) { id createdAt } }`
      : `mutation { createTicket(input: {serviceId: 1, description: "${info.description}", title: "${info.title}", user: "${info.clientPhone}", asset: "${info.asset}", location: {  locationName: "${info.address}" }}) { id status } }`;

  const handleSelectClient = (clientId: number, clientEmail: string, clientPhone: string) => {
    dispatch({ type: "set", key: "clientId", value: clientId });
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: clientPhone });
    setSelectClient(false);
  };

  const handleAssetChange = (value: string) => {
    dispatch({ type: "set", key: "asset", value });

    const getProduct = async () => {
      const productResult = await getServerData(`query { productItem(sn: "${value}") { product { id name } } }`);
      if (productResult.data?.productItem?.product != null) {
        dispatch({
          type: "set",
          key: "productName",
          value: productResult.data.productItem.product.name
        });
        dispatch({
          type: "set",
          key: "productId",
          value: productResult.data.productItem.product.id
        });
      } else {
        dispatch({ type: "set", key: "productId", value: 0 });
        dispatch({ type: "set", key: "productName", value: "" });
      }
    };
    getProduct();
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
    dispatch({ type: "set", key: "productId", value: initialInfo.productId });
    dispatch({ type: "set", key: "asset", value: initialInfo.asset });
    dispatch({ type: "set", key: "status", value: initialInfo.status });
    dispatch({ type: "set", key: "center", value: initialInfo.center });

    if (result?.data?.createTicket?.id != null) {
      // await getServerData(
      //   `mutation { ${centers
      //     .filter((center) => center.name === info.center)[0]
      //     .admins.map(
      //       (admin, i) =>
      //         `createTicketAssignment${i}: createTicketAssignment(ticketId: ${result.data.createTicket.id}, assignTo: "${admin.user}") { id }`
      //     )
      //     .join(" ")} }`,
      //   true
      // );
      await getServerData(
        `mutation { createTicketAssignment(input: {ticketId: ${result.data.createTicket.id}, assignTo: "${info.center}", targetType: ${targetType}}) { id }}`,
        true
      );
    }
    if (onUpdate !== undefined) onUpdate();
  };

  // on load
  React.useEffect(() => {
    const loadTicket = async () => {
      const result = await getServerData(
        `query { ticket(id: ${id}) { id title description status title user asset location { locationName } assignments { assignTo } priority createdBy createdAt } }`,
        true
      );

      if (result.data.ticket != null) {
        dispatch({ type: "set", key: "createdAt", value: result.data.ticket.createdAt });
        dispatch({ type: "set", key: "title", value: result.data.ticket.title });
        dispatch({ type: "set", key: "description", value: result.data.ticket.description });
        dispatch({ type: "set", key: "priority", value: result.data.ticket.priority });
        dispatch({ type: "set", key: "asset", value: result.data.ticket.asset });
        dispatch({ type: "set", key: "address", value: result.data.ticket.location?.locationName ?? "" });
        dispatch({ type: "set", key: "center", value: result.data.ticket.assignments?.at(0)?.assignTo ?? "" });
        dispatch({ type: "set", key: "status", value: result.data.ticket.status });
        dispatch({ type: "set", key: "createdBy", value: result.data.ticket.createdBy });
        handleAssetChange(result.data.ticket.asset);

        if (result.data.ticket.user != null) {
          const resultUser = await getServerData(`query { clientByPhone(phone: "${result.data.ticket.user}") { id phone email } }`);
          dispatch({ type: "set", key: "clientId", value: resultUser.data.clientByPhone.id });
          dispatch({ type: "set", key: "clientPhone", value: resultUser.data.clientByPhone.phone });
          dispatch({ type: "set", key: "clientEmail", value: resultUser.data.clientByPhone.email });
        }

        await loadCenters(result.data.ticket.assignments?.reverse()?.at(0)?.assignTo);
      }
    };

    const loadCenters = async (parentName?: string) => {
      let centerResults: Center[] = [];
      if (id === undefined || accessType === AccessType.READ_ACCESS) {
        const centersResponse = await getServerData(`query { centers(parentId: null) { id name admins { user } } }`);
        centerResults = centersResponse.data.centers;
      } else if (parentName != null && (accessType === AccessType.FULL_ACCESS || accessType === AccessType.UPDATE_ACCESS)) {
        const centersResponse = await getServerData(`query { centersByParentName(parentCenter: "${parentName}") { id name admins { user } } }`);
        if (centersResponse.data.centersByParentName.length > 0) centerResults = centersResponse.data.centersByParentName;
        console.log(centersResponse.data.centersByParentName);
        if (centerResults.length === 0) {
          const centerResponse = await getServerData(`query { centerByName(name: "${parentName}") { id name admins { id user role } } }`);
          centerResults = (centerResponse.data.centerByName.admins as Admin[])
            .filter((admin) => admin.role === "TECHNICAL")
            .map((admin) => ({ id: admin.id, name: admin.user, admins: [] }));
          setTargetType("USER");
        }
      }

      setCenters(centerResults);
    };

    if (id !== undefined) loadTicket();
    else loadCenters();

    loadCenters();
  }, [id]);

  // render component
  return (
    <ContentForm
      id={id}
      name="ticket"
      title="Ticket Info"
      command={ticketCommand}
      isService={true}
      onUpdate={(result) => handleSave(result)}
      commandDisabled={
        (id === undefined && (info.clientId === 0 || info.address === "" || info.center === "" || info.productId === 0)) ||
        accessType === AccessType.READ_ACCESS
      }
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
      <div className="column-double space-top">
        <Button fullWidth variant="contained" color="primary" disabled={info.productId === 0} onClick={() => setViewProduct(true)}>
          <Redeem />
          {info.productId === 0 ? "Put valid product SN" : (info.productName as string)}
        </Button>
        <FormControl fullWidth>
          <TextField
            variant="outlined"
            label="product sn"
            value={info.asset}
            InputProps={{ readOnly: id !== undefined }}
            onChange={(e) => handleAssetChange(e.target.value)}
          />
        </FormControl>
      </div>
      {(id === undefined || accessType !== AccessType.CREATE_ACCESS) && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="center-label">{targetType === "GROUP" ? "Centers" : "Technicals"}</InputLabel>
          <Select
            labelId="center-label"
            variant="outlined"
            label={targetType === "GROUP" ? "Centers" : "Technicals"}
            defaultValue={info.center}
            value={info.center}
            readOnly={accessType === AccessType.READ_ACCESS}
            onChange={(e) => dispatch({ type: "set", key: "center", value: e.target.value })}
          >
            {centers.map((center) => (
              <MenuItem key={center.id} value={center.name} disabled={targetType === "GROUP" && center.admins?.length === 0}>
                {center.name} {targetType === "GROUP" && center.admins?.length === 0 ? "<no users>" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
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
              readOnly={accessType !== AccessType.CREATE_ACCESS}
              onChange={(e) => dispatch({ type: "set", key: "status", value: e.target.value })}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status} disabled={status !== "RESOLVED" && status !== "UNRESOLVED"}>
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
              readOnly={accessType === AccessType.READ_ACCESS || accessType === AccessType.CREATE_ACCESS}
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
      {accessType === AccessType.CREATE_ACCESS && (
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            label="solution"
            value={info.solution}
            onChange={(e) => dispatch({ type: "set", key: "solution", value: e.target.value })}
          />
        </FormControl>
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
      <Modal open={viewProduct} onClose={() => setViewProduct(false)}>
        <div className="modal">
          <ProductView id={Number(info.productId)} />
        </div>
      </Modal>
    </ContentForm>
  );
};

export default Ticket;
