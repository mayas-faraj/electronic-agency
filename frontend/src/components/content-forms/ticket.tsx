import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, TextField, Select, Button, Modal, Box } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ProductView from "../views/product";
import ClientSelect from "../content-tables/clients";
import ProductSelect from "../content-tables/products";
import getServerData from "../../libs/server-data";
import ProfileContext from "../profile-context";

const initialInfo = {
  address: "",
  title: "",
  description: "",
  priority: "NORMAL",
  asset: "",
  productId: 0,
  productName: "",
  initialStatus: "NEW",
  status: "NEW",
  clientUser: "",
  clientEmail: "",
  clientPhone: "",
  clientFirstName: "",
  clientLastName: "",
  currentCenter: "",
  currentTargetType: "GROUP",
  center: "",
  createdAt: "",
  createdBy: "",
  solution: ""
};

interface ITicketProps {
  id?: number;
  onUpdate?: () => void;
}

type Center = {
  id: number;
  name: string;
  users: {
    user: string;
  }[];
};

type Admin = {
  id: number;
  user: string;
  userRoles: {
    role: {
      name: string;
    };
  }[];
};

type Communication = {
  text: string;
  user: string;
  createdAt: Date;
};

enum Mode {
  SuperAdmin,
  TopCallCenter,
  CallCenter,
  Technician,
  Closer,
  Feedback,
  Viewer
}

const statuses = ["NEW", "OPEN", "PENDING", "IN_PROGRESS", "RESOLVED", "UNRESOLVED", "FEEDBACK", "CLOSED", "REOPEN"];
const priorities = ["CRITICAL", "HIGH", "NORMAL", "LOW"];

const Ticket: FunctionComponent<ITicketProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);
  // component hooks
  const profile = React.useContext(ProfileContext);
  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [viewProduct, setViewProduct] = React.useState(false);
  const [selectProduct, setSelectProduct] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [centers, setCenters] = React.useState<Center[]>([]);
  const [targetType, setTargetType] = React.useState("GROUP");
  const [communications, setCommunications] = React.useState<Communication[]>([]);

  let mode: Mode = Mode.Viewer;
  if (profile.privileges.createAdmin) mode = Mode.SuperAdmin;
  else if (profile.privileges.createTicket && info.initialStatus === "NEW") mode = Mode.TopCallCenter;
  else if (
    profile.privileges.updateTicket &&
    (profile.center?.name === info.currentCenter || info.initialStatus === "UNRESOLVED") &&
    (info.initialStatus === "OPEN" || info.initialStatus === "PENDING" || info.initialStatus === "UNRESOLVED")
  )
    mode = Mode.CallCenter;
  else if (profile.privileges.createRepair && info.initialStatus === "IN_PROGRESS") mode = Mode.Technician;
  else if (profile.privileges.updateRepair && info.initialStatus === "RESOLVED") mode = Mode.Closer;
  else if (profile.privileges.createFeedback && info.initialStatus === "CLOSED") mode = Mode.Feedback;

  // process form type (create or update)
  const phoneSeperatorIndex = (info.clientPhone as string).indexOf("/");
  const phone = phoneSeperatorIndex >= 0 ? (info.clientPhone as string).substring(0, phoneSeperatorIndex) : info.clientPhone;
  const asset = info.asset !== "" ? info.asset : `[product-${info.productId}]`;
  const assignToRole = targetType === "GROUP" ? "GROUP" : "technician";

  const createTicketCommand = `createTicket(input: {serviceId: 1, description: "${info.description}", title: "${info.title}", user: "${phone}", asset: "${asset}", location: {  locationName: "${info.address}" }}) { id status }`;
  const updateTicketStatusCommand = `updateTicketStatus: updateTicket(id: ${id}, input: {status: ${info.status}}) { id status }`;
  const updateTicketPriorityCommand = `updateTicketPriority: updateTicket(id: ${id}, input: {priority: ${info.priority}}) { id priority }`;
  const createTicketAssignmentCommand = `createTicketAssignment(input: {ticketId: ${id}, assignTo: "${info.center}", assignToRole: "${assignToRole}", targetType: ${targetType}}) { id createdAt }`;
  const createTicketCommunicationCommand = `createTicketCommunication(input: {ticketId: ${id}, text: "${info.solution}" }) { id text }`;

  const ticketCommand =
    id === undefined
      ? `mutation { ${createTicketCommand} }`
      : `mutation { 
          ${mode === Mode.CallCenter ? updateTicketPriorityCommand + " " + createTicketAssignmentCommand : ""}
          ${(mode === Mode.Technician || mode === Mode.Feedback) && info.solution !== "" ? createTicketCommunicationCommand : ""}
          ${mode === Mode.Technician || mode === Mode.Closer || mode === Mode.Feedback ? updateTicketStatusCommand : ""}
        }`;

  // event handlers
  const handleSelectClient = (
    _: number,
    clientEmail: string,
    clientPhone: string,
    clientUser: string,
    clientFirstName: string,
    clientLastName: string,
    _clientCompany: string,
    clientPhone2: string,
    clientAddress: string,
    clientAddress2: string
  ) => {
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: `${clientPhone}${clientPhone2 ? "/" + clientPhone2 : ""}` });
    dispatch({ type: "set", key: "clientUser", value: clientUser });
    dispatch({ type: "set", key: "clientFirstName", value: clientFirstName });
    dispatch({ type: "set", key: "clientLastName", value: clientLastName });
    dispatch({ type: "set", key: "address", value: `${clientAddress != null ? clientAddress : ""}${clientAddress2 ? "/" + clientAddress2 : ""}` });

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

    if (value.startsWith("[product-") && value.endsWith("]")) dispatch({ type: "set", key: "productId", value: parseInt(value.substring(9, value.length - 1)) });
    else getProduct();
  };

  const handleSave = async (result: any) => {
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
    dispatch({ type: "set", key: "initialStatus", value: initialInfo.status });
    dispatch({ type: "set", key: "status", value: initialInfo.status });
    dispatch({ type: "set", key: "currentCenter", value: initialInfo.currentCenter });
    dispatch({ type: "set", key: "currentTargetType", value: initialInfo.currentTargetType });
    dispatch({ type: "set", key: "center", value: initialInfo.center });
    dispatch({ type: "set", key: "solution", value: initialInfo.solution });

    if (result?.data?.createTicket?.id != null) {
      await getServerData(`mutation { createTicketAssignment(input: {ticketId: ${result.data.createTicket.id}, assignTo: "${info.center}", targetType: GROUP}) { id }}`, true);
    }
    if (onUpdate !== undefined) onUpdate();
  };

  // on load
  React.useEffect(() => {
    const loadTicket = async () => {
      const result = await getServerData(
        `query { ticket(id: ${id}) { id title description status title user asset location { locationName } assignments { assignTo targetType } communications { text user createdAt } priority createdBy createdAt } }`,
        true
      );
      if (result.data.ticket != null) {
        dispatch({ type: "set", key: "createdAt", value: result.data.ticket.createdAt });
        dispatch({ type: "set", key: "title", value: result.data.ticket.title });
        dispatch({ type: "set", key: "description", value: result.data.ticket.description });
        dispatch({ type: "set", key: "priority", value: result.data.ticket.priority });
        dispatch({ type: "set", key: "address", value: result.data.ticket.location?.locationName ?? "" });
        dispatch({ type: "set", key: "initialStatus", value: result.data.ticket.status });
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

        dispatch({ type: "set", key: "currentCenter", value: result.data.ticket.assignments?.toReversed().at(0)?.assignTo ?? "" });
        dispatch({ type: "set", key: "currentTargetType", value: result.data.ticket.assignments?.toReversed().at(0)?.targetType ?? "" });
        dispatch({ type: "set", key: "center", value: result.data.ticket.assignments?.toReversed().at(0)?.assignTo ?? "" });

        if (result.data.ticket.user != null) {
          const resultUser = await getServerData(`query { clientByPhone(phone: "${result.data.ticket.user}") { id phone email user firstName lastName phone2 address address2 } }`);
          dispatch({ type: "set", key: "clientPhone", value: resultUser.data.clientByPhone.phone });
          dispatch({
            type: "set",
            key: "clientPhone",
            value: `${resultUser.data.clientByPhone.phone}${resultUser.data.clientByPhone.phone2 ? "/" + resultUser.data.clientByPhone.phone2 : ""}`
          });
          dispatch({ type: "set", key: "clientEmail", value: resultUser.data.clientByPhone.email });
          dispatch({ type: "set", key: "clientUser", value: resultUser.data.clientByPhone.user });
          dispatch({ type: "set", key: "clientFirstName", value: resultUser.data.clientByPhone.firstName });
          dispatch({ type: "set", key: "clientLastName", value: resultUser.data.clientByPhone.lastName });
        }

        setCommunications(result.data.ticket.communications);

        await loadCenters(getAssignmentGroup(result.data.ticket.assignments?.toReversed()));
      }
    };

    const getAssignmentGroup = (assignments?: Array<{ targetType: string; assignTo: string }>): string => {
      if (assignments == null || assignments.length === 0) return "";
      for (let i = 0; i < assignments.length; i++) if (assignments[i].targetType === "GROUP") return assignments[i].assignTo;
      return assignments[0].assignTo;
    };

    const loadCenters = async (parentName?: string) => {
      let centerResults: Center[] = [];
      if (id === undefined || mode === Mode.SuperAdmin || mode === Mode.TopCallCenter) {
        const centersResponse = await getServerData(`query { centers(parentId: null) { id name users { user } } }`);
        centerResults = centersResponse.data.centers;
      } else if (parentName != null && mode === Mode.CallCenter) {
        const centersResponse = await getServerData(`query { centersByParentName(parentCenter: "${parentName}") { id name users { user } } }`);
        if (centersResponse.data.centersByParentName.length > 0) centerResults = centersResponse.data.centersByParentName;

        if (centerResults.length === 0) {
          const centerResponse = await getServerData(`query { centerByName(name: "${parentName}") { id name users { id user userRoles { role { name } } } } }`);
          centerResults = ((centerResponse.data.centerByName?.users ?? []) as Admin[])
            .filter((admin) => admin.userRoles.map((userRole) => userRole.role.name).indexOf("technician") >= 0)
            .map((admin) => ({ id: admin.id, name: admin.user, users: [] }));
          setTargetType("USER");
        }
      }

      setCenters(centerResults);
    };

    if (id !== undefined) loadTicket();
    else loadCenters();
  }, [id, mode]);

  // render component
  return (
    <ContentForm
      id={id}
      name="ticket"
      title="Ticket Info"
      command={ticketCommand}
      isService={true}
      onUpdate={(result) => handleSave(result)}
      commandDisabled={id === undefined && (info.clientUser === "" || info.address === "" || info.center === "" || info.productId === 0)}
      isDisabled={mode === Mode.Viewer}
    >
      {id !== undefined && <h2 className="subtitle">Ticket :{id.toString()}</h2>}
      <Box component="fieldset">
        <legend>Client</legend>
        {id === undefined && (
          <ClientSelect
            isSelectable={true}
            displayOneRow={true}
            onUpdate={(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, clientCompany, clientPhone2, clientAddress, clientAddress2) =>
              handleSelectClient(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, clientCompany, clientPhone2, clientAddress, clientAddress2)
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
            <TextField variant="outlined" InputProps={{ readOnly: id !== undefined }} label="Product SN" value={info.asset} onChange={(e) => handleAssetChange(e.target.value)} />
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
      {(mode !== Mode.TopCallCenter || id !== undefined) && (
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            InputProps={{ readOnly: id !== undefined }}
            label={`Current ${info.currentTargetType === "GROUP" ? "Center" : "Techincal"}`}
            value={info.currentCenter}
          />
        </FormControl>
      )}
      {((mode === Mode.TopCallCenter && id === undefined) || mode === Mode.CallCenter) && (
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
              <MenuItem key={center.id} value={center.name} disabled={targetType === "GROUP" && center.users?.length === 0}>
                {center.name} {targetType === "GROUP" && center.users?.length === 0 ? "<no users>" : ""}
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
              readOnly={mode !== Mode.Technician && mode !== Mode.Feedback && mode !== Mode.Closer}
              onChange={(e) => dispatch({ type: "set", key: "status", value: e.target.value })}
            >
              {statuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                  disabled={
                    (mode !== Mode.Technician || (status !== "RESOLVED" && status !== "UNRESOLVED")) &&
                    (mode !== Mode.Closer || status !== "CLOSED") &&
                    (mode !== Mode.Feedback || status !== "FEEDBACK")
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
              readOnly={mode !== Mode.CallCenter}
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
      {(mode === Mode.Technician || mode === Mode.Feedback) && (
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            label={mode === Mode.Feedback ? "Feedback" : "Solution"}
            value={info.solution}
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
            onUpdate={(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, clientCompany, clientPhone2, clientAddress, clientAddress2) =>
              handleSelectClient(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, clientCompany, clientPhone2, clientAddress, clientAddress2)
            }
          />
        </div>
      </Modal>
      <Modal open={viewClient} onClose={() => setViewClient(false)}>
        <div className="modal">
          <ClientView user={info.clientUser as string} />
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
