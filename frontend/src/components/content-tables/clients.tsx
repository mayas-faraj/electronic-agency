import React, { FunctionComponent } from "react";
import { Button, InputAdornment, Modal, TextField } from "@mui/material";
import { CheckCircle, Search, Visibility } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import ClientView from "../views/client";
import RoleContext from "../role-context";
import getServerData from "../../libs/server-data";

// types
interface IClient {
  id: number;
  user: string;
  phone: string;
  email: string;
  isDisabled: boolean;
}

interface IClientsType {
  isSelectable?: boolean;
  onUpdate?: (id: number, email: string, phone: string) => void;
}

// main component
const Clients: FunctionComponent<IClientsType> = ({ isSelectable, onUpdate }) => {
  // client state
  const [clients, setClients] = React.useState<IClient[]>([]);
  const [viewId, setViewId] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");

  // context
  const privileges = React.useContext(RoleContext);

  // clients schema
  const tableHeader: ITableHeader[] = [
    { key: "user", title: "User Name" },
    { key: "phone", title: "Phone" },
    { key: "isDisabled", title: "Disable", isControlType: true },
    { key: "view", title: "More Info", isSpecialType: true },
    { key: "delete", title: "Delete", isControlType: true }
  ];

  if (isSelectable) tableHeader.push({ key: "select", title: "select" });

  // on load
  const action = React.useCallback(async () => {
    const result = await getServerData(`query { clients(filter: {keyword: "${keyword}"}) { id user phone email isDisabled }}`);
    setClients(result.data.clients);
  }, [keyword]);

  // event handler
  React.useEffect(() => {
    action();
  }, [action]);

  // render
  return (
    <div>
      <TextField
        label="Search"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />
      <ContentTable
        name="client"
        addNewLink="/add-client"
        isAddNewRight={true}
        headers={tableHeader}
        canRead={privileges.readClient}
        canWrite={privileges.writeClient}
        data={clients.map((client) => ({
          user: client.user,
          phone: client.phone,
          isDisabled: (
            <Management
              type={ManagementType.switch}
              operation={Operation.update}
              command={`mutation { updateClient(id: ${client.id}, input: {isDisabled: ${!client.isDisabled}})  {id}}`}
              initialValue={client.isDisabled}
              onUpdate={() => action()}
            />
          ),
          view: (
            <Button variant="text" color="info" onClick={() => setViewId(client.id)}>
              <Visibility />
            </Button>
          ),
          delete: (
            <Management
              type={ManagementType.button}
              operation={Operation.delete}
              command={`mutation { deleteClient(id: ${client.id})  {id}}`}
              hasConfirmModal={true}
              onUpdate={() => action()}
            />
          ),
          select:
            isSelectable && onUpdate !== undefined ? (
              <Button variant="text" color="info" onClick={() => onUpdate(client.id, client.email, client.phone)}>
                <CheckCircle />
              </Button>
            ) : undefined
        }))}
      />
      <Modal open={viewId !== 0} onClose={() => setViewId(0)}>
        <div className="modal">
          <ClientView id={viewId} />
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
