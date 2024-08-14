import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, TextField, Select, Button, Modal, Box } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ProductView from "../views/product";
import ClientSelect from "../content-tables/clients";
import ProductSelect from "../content-tables/products";
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
  clientUser: "",
  clientFirstName: "",
  clientLastName: "",
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
type Communication = {
  text: string;
  user: string;
  createdAt: Date;
};

const statuses = ["NEW", "OPEN", "PENDING", "IN_PROGRESS", "RESOLVED", "UNRESOLVED", "FEEDBACK", "CLOSED", "REOPEN"];
const priorities = ["CRITICAL", "HIGH", "NORMAL", "LOW"];

const Ticket: FunctionComponent<ITicketProps> = ({ accessType, id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);
  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [viewProduct, setViewProduct] = React.useState(false);
  const [selectProduct, setSelectProduct] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [centers, setCenters] = React.useState<Center[]>([]);
  const [targetType, setTargetType] = React.useState("GROUP");
  const [communications, setCommunications] = React.useState<Communication[]>([]);

  // process form type (create or update)
  const updateTicketCommand = `updateTicket(id: ${id}, input: {${
    accessType === AccessType.CREATE_ACCESS || info.status === "CLOSED" ? `status: ${info.status},` : ""
  } priority: ${info.priority}}) { id priority status }`;
  const createTicketAssignmentCommand = `createTicketAssignment(input: {ticketId: ${id}, assignTo: "${info.center}", assignToRole: "${
    targetType === "GROUP" ? "GROUP" : "LOGISTICS_MANAGER"
  }", targetType: ${targetType}}) { id createdAt }`;
  const createTicketAssignmentFeedbackCommand = `createTicketAssignment(input: {ticketId: ${id}, assignTo: "feedback", assignToRole: "FEEDBACK", targetType: USER}) { id createdAt }`;
  const createTicketCommunicationCommand = `createTicketCommunication(input: {ticketId: ${id}, text: "${info.solution}" }) { id text }`;
  const ticketCommand =
    id !== undefined
      ? `mutation { 
          ${updateTicketCommand} 
          ${
            accessType !== AccessType.CREATE_ACCESS && accessType !== AccessType.TWEAK_ACCESS && info.status !== "CLOSED"
              ? createTicketAssignmentCommand
              : ""
          } 
          ${accessType === AccessType.TWEAK_ACCESS ? createTicketAssignmentFeedbackCommand : ""} 
          ${info.solution !== "" ? createTicketCommunicationCommand : ""}
        }`
      : `mutation { createTicket(input: {serviceId: 1, description: "${info.description}", title: "${info.title}", user: "${
          info.clientPhone
        }", asset: "${info.asset !== "" ? info.asset : `[product-${info.productId}]`}", location: {  locationName: "${
          info.address
        }" }}) { id status } }`;

  // event handlers
  const handleSelectClient = (
    clientId: number,
    clientEmail: string,
    clientPhone: string,
    clientUser: string,
    clientFirstName: string,
    clientLastName: string
  ) => {
    dispatch({ type: "set", key: "clientId", value: clientId });
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: clientPhone });
    dispatch({ type: "set", key: "clientUser", value: clientUser });
    dispatch({ type: "set", key: "clientFirstName", value: clientFirstName });
    dispatch({ type: "set", key: "clientLastName", value: clientLastName });
    setSelectClient(false);
  };

  const handleSelectProduct = (productId: number, name: string) => {
    dispatch({ type: "set", key: "asset", value: "" });
    dispatch({ type: "set", key: "productId", value: productId });
    dispatch({ type: "set", key: "productName", value: name });

    setSelectProduct(false);
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

    if (value.startsWith("[product-") && value.endsWith("]"))
      dispatch({ type: "set", key: "productId", value: parseInt(value.substring(9, value.length - 1)) });
    else getProduct();
  };

  const handleSave = async (result: any) => {
    dispatch({ type: "set", key: "clientId", value: initialInfo.clientId });
    dispatch({ type: "set", key: "clientPhone", value: initialInfo.clientPhone });
    dispatch({ type: "set", key: "clientEmail", value: initialInfo.clientEmail });
    dispatch({ type: "set", key: "clientUser", value: initialInfo.clientUser });
    dispatch({ type: "set", key: "clientFirstName", value: initialInfo.clientFirstName });
    dispatch({ type: "set", key: "clientLastName", value: initialInfo.clientLastName });
    dispatch({ type: "set", key: "createdAt", value: initialInfo.createdAt });
    dispatch({ type: "set", key: "address", value: initialInfo.address });
    dispatch({ type: "set", key: "description", value: initialInfo.description });
    dispatch({ type: "set", key: "title", value: initialInfo.title });
    dispatch({ type: "set", key: "priority", value: initialInfo.priority });
    dispatch({ type: "set", key: "productId", value: initialInfo.productId });
    dispatch({ type: "set", key: "asset", value: initialInfo.asset });
    dispatch({ type: "set", key: "status", value: initialInfo.status });
    dispatch({ type: "set", key: "center", value: initialInfo.center });
    dispatch({ type: "set", key: "solution", value: initialInfo.solution });

    if (result?.data?.createTicket?.id != null) {
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
        `query { ticket(id: ${id}) { id title description status title user asset location { locationName } assignments { assignTo } communications { text user createdAt } priority createdBy createdAt } }`,
        true
      );

      if (result.data.ticket != null) {
        dispatch({ type: "set", key: "createdAt", value: result.data.ticket.createdAt });
        dispatch({ type: "set", key: "title", value: result.data.ticket.title });
        dispatch({ type: "set", key: "description", value: result.data.ticket.description });
        dispatch({ type: "set", key: "priority", value: result.data.ticket.priority });
        dispatch({ type: "set", key: "address", value: result.data.ticket.location?.locationName ?? "" });
        dispatch({ type: "set", key: "status", value: result.data.ticket.status });
        dispatch({ type: "set", key: "createdBy", value: result.data.ticket.createdBy });

        if (result.data.ticket.asset.startsWith("[product-") && result.data.ticket.asset.endsWith("]")) {
          const asset = result.data.ticket.asset;
          const productId = parseInt(asset.substring(9, asset.length - 1));
          const productName = await getServerData(`query { product(id: ${productId}) { name }}`);
          dispatch({ type: "set", key: "productName", value: productName.data.product.name });
        } else {
          dispatch({ type: "set", key: "asset", value: result.data.ticket.asset });
          handleAssetChange(result.data.ticket.asset);
        }

        let assignmentIndex = 0;
        if (result.data.ticket.status === "UNRESOLVED") assignmentIndex = 1;
        dispatch({ type: "set", key: "center", value: result.data.ticket.assignments?.at(assignmentIndex)?.assignTo ?? "" });

        if (result.data.ticket.user != null) {
          const resultUser = await getServerData(
            `query { clientByPhone(phone: "${result.data.ticket.user}") { id phone email user firstName lastName } }`
          );
          dispatch({ type: "set", key: "clientId", value: resultUser.data.clientByPhone.id });
          dispatch({ type: "set", key: "clientPhone", value: resultUser.data.clientByPhone.phone });
          dispatch({ type: "set", key: "clientEmail", value: resultUser.data.clientByPhone.email });
          dispatch({ type: "set", key: "clientUser", value: resultUser.data.clientByPhone.user });
          dispatch({ type: "set", key: "clientFirstName", value: resultUser.data.clientByPhone.firstName });
          dispatch({ type: "set", key: "clientLastName", value: resultUser.data.clientByPhone.lastName });
        }

        setCommunications(result.data.ticket.communications);

        await loadCenters(result.data.ticket.assignments?.reverse()?.at(assignmentIndex)?.assignTo);
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

        if (centerResults.length === 0) {
          const centerResponse = await getServerData(`query { centerByName(name: "${parentName}") { id name admins { id user role } } }`);
          centerResults = ((centerResponse.data.centerByName?.admins ?? []) as Admin[])
            .filter((admin) => admin.role === "LOGISTICS_MANAGER")
            .map((admin) => ({ id: admin.id, name: admin.user, admins: [] }));
          setTargetType("USER");
        }
      }

      setCenters(centerResults);
    };

    if (id !== undefined) loadTicket();
    else loadCenters();

    loadCenters();
  }, [id, accessType]);

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
      <Box component="fieldset">
        <legend>Client</legend>
        {id === undefined && (
          <ClientSelect
            isSelectable={true}
            displayOneRow={true}
            onUpdate={(clientId, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName) =>
              handleSelectClient(clientId, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName)
            }
          />
        )}
        <div className="column-double">
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" InputProps={{ readOnly: true }} label="Client Name" value={info.clientUser} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" InputProps={{ readOnly: true }} label="Client Phone" value={info.clientPhone} />
          </FormControl>
        </div>
        <div className="column-double">
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" InputProps={{ readOnly: true }} label="First Name" value={info.clientFirstName} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" InputProps={{ readOnly: true }} label="Last Name" value={info.clientLastName} />
          </FormControl>
        </div>
        <div className="column-double">
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" InputProps={{ readOnly: true }} label="Client Email" value={info.clientEmail} />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              InputProps={{ readOnly: id !== undefined }}
              label="Client Address"
              value={info.address}
              onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value })}
            />
          </FormControl>
        </div>
      </Box>
      <Box component="fieldset" className="space-top">
        <legend>Product</legend>
        <div className="column-double">
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              InputProps={{ readOnly: id !== undefined }}
              label="Product SN"
              value={info.asset}
              onChange={(e) => handleAssetChange(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Button className="button" variant="contained" onClick={() => setSelectProduct(true)} disabled={id !== undefined}>
              Select Product
            </Button>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" InputProps={{ readOnly: id !== undefined }} label="Product Name" value={info.productName} />
          </FormControl>
        </div>
      </Box>
      {accessType === AccessType.READ_ACCESS && (
        <FormControl fullWidth margin="normal">
          <TextField variant="outlined" InputProps={{ readOnly: id !== undefined }} label="Current center" value={info.center} />
        </FormControl>
      )}
      {centers.length > 0 && (id === undefined || accessType === AccessType.FULL_ACCESS || accessType === AccessType.UPDATE_ACCESS) && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="center-label">{targetType === "GROUP" ? "Centers" : "Technicals"}</InputLabel>
          <Select
            labelId="center-label"
            variant="outlined"
            label={targetType === "GROUP" ? "Centers" : "Technicals"}
            defaultValue={info.center}
            value={info.center}
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
              readOnly={
                (accessType !== AccessType.CREATE_ACCESS || info.status === "RESOLVED" || info.status === "UNRESOLVED") &&
                (accessType !== AccessType.UPDATE_ACCESS || info.status === "CLOSED")
              }
              onChange={(e) => dispatch({ type: "set", key: "status", value: e.target.value })}
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                  disabled={
                    (accessType === AccessType.CREATE_ACCESS && status !== "RESOLVED" && status !== "UNRESOLVED") ||
                    (accessType === AccessType.UPDATE_ACCESS && status !== "CLOSED")
                  }
                >
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
              readOnly={accessType === AccessType.READ_ACCESS || accessType === AccessType.CREATE_ACCESS || accessType === AccessType.TWEAK_ACCESS}
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
      {(accessType === AccessType.CREATE_ACCESS || accessType === AccessType.TWEAK_ACCESS || info.solution !== "") && (
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            label={accessType === AccessType.TWEAK_ACCESS ? "Feedback" : "Solution"}
            value={info.solution}
            InputProps={{ readOnly: accessType !== AccessType.CREATE_ACCESS && accessType !== AccessType.TWEAK_ACCESS }}
            onChange={(e) => dispatch({ type: "set", key: "solution", value: e.target.value })}
          />
        </FormControl>
      )}
      {communications?.map((communication) => (
        <div className="communication">
          <span>{communication.user}: </span>
          <span>{communication.text}. </span>
          <span>at {new Date(communication.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
      <Modal open={selectClient} onClose={() => setSelectClient(false)}>
        <div className="modal">
          <ClientSelect
            isSelectable={true}
            onUpdate={(clientId, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName) =>
              handleSelectClient(clientId, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName)
            }
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
      <Modal open={selectProduct} onClose={() => setSelectProduct(false)}>
        <div className="modal">
          <ProductSelect isSelectable={true} onUpdate={(productId, name) => handleSelectProduct(productId, name)} />
        </div>
      </Modal>
    </ContentForm>
  );
};

export default Ticket;
