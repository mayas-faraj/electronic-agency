import React, { FunctionComponent } from "react";
import { Button, InputAdornment, Modal, TextField } from "@mui/material";
import { CheckCircle, Search, Visibility } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import ClientView from "../views/client";
import ProfileContext from "../profile-context";
import getServerData from "../../libs/server-data";

// types
interface IClient {
  id: number;
  user: string;
  phone: string;
  phone2: string;
  address: string;
  address2: string;
  company: string;
  email: string;
  firstName: string;
  lastName: string;
  isDisabled: boolean;
}

interface IClientsType {
  isSelectable?: boolean;
  displayOneRow?: boolean;
  onUpdate?: (
    id: number,
    email: string,
    phone: string,
    name: string,
    firstName: string,
    lastName: string,
    company: string,
    phone2: string,
    address: string,
    address2: string
  ) => void;
}

// main component
const Clients: FunctionComponent<IClientsType> = ({ isSelectable, displayOneRow, onUpdate }) => {
  // client state
  const [clients, setClients] = React.useState<IClient[]>([]);
  const [viewUser, setViewUser] = React.useState("");
  const [keyword, setKeyword] = React.useState("");

  // context
  const privileges = React.useContext(ProfileContext);

  // clients schema
  const tableHeader: ITableHeader[] = [
    { key: "company", title: "Company Name" },
    { key: "fullName", title: "Full Name" },
    { key: "phone", title: "Phone" }
  ];

  if (isSelectable) tableHeader.push({ key: "select", title: "Select" });
  else {
    tableHeader.push({ key: "isDisabled", title: "Disable", type: HeaderType.UPDATE });
    tableHeader.push({ key: "view", title: "More Info", type: HeaderType.SPECIAL });
    tableHeader.push({ key: "delete", title: "Delete", type: HeaderType.DELETE });
  }

  // on load
  const action = React.useCallback(async () => {
    const result = await getServerData(
      `query { clients(filter: {keyword: "${keyword}", showDisabled: true}) { id user phone phone2 address address2 company email firstName lastName isDisabled }}`
    );
    if (displayOneRow) {
      if (result.data.clients?.length === 1) setClients([result.data.clients[0]]);
      else setClients([]);
    } else setClients(result.data.clients);
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
        addNewLink={"/add-client"}
        isAddNewRight={true}
        headers={tableHeader}
        canCreate={privileges.createClient}
        canDelete={privileges.deleteClient}
        canRead={privileges.readClient}
        canUpdate={privileges.updateClient}
        hidePagination={displayOneRow}
        data={clients.map((client) => ({
          company: client.company ?? "<No Company>",
          fullName: `${client.firstName} ${client.lastName !== null ? client.lastName : ""}`,
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
            <Button variant="text" color="info" onClick={() => setViewUser(client.user)}>
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
              <Button
                variant="text"
                color="info"
                onClick={() =>
                  onUpdate(
                    client.id,
                    client.email,
                    client.phone,
                    client.user,
                    client.firstName,
                    client.lastName,
                    client.company,
                    client.phone2,
                    client.address,
                    client.address2
                  )
                }
              >
                <CheckCircle />
              </Button>
            ) : undefined
        }))}
      />
      <Modal open={viewUser !== ""} onClose={() => setViewUser("")}>
        <div className="modal">
          <ClientView user={viewUser} />
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
