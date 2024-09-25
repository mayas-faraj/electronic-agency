import React, { FunctionComponent } from "react";
import { Button, InputAdornment, Modal, TextField } from "@mui/material";
import { Edit, Search, Visibility, LockReset, Language } from "@mui/icons-material";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import AdminForm from "../content-forms/admin";
import AdminView from "../views/admin";
import ProfileContext from "../profile-context";
import getServerData from "../../libs/server-data";
import Password from "../content-forms/password";
import { Link } from "react-router-dom";

// types
interface IAdmin {
  id: number;
  user: string;
  userRoles: {
    role: {
      name: string;
    };
  }[];
  isDisabled: boolean;
  center?: {
    name: string;
  };
}

// main component
const Admins: FunctionComponent = () => {
  // admin state
  const [admins, setAdmins] = React.useState<IAdmin[]>([]);
  const [passwordId, setPasswordId] = React.useState(0);
  const [editId, setEditId] = React.useState(0);
  const [viewId, setViewId] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");

  // context
  const privileges = React.useContext(ProfileContext);

  // admin schema
  const tableHeader: ITableHeader[] = [
    { key: "user", title: "User Name" },
    { key: "role", title: "Role" },
    { key: "center", title: "Center" },
    { key: "isDisabled", title: "Disable", type: HeaderType.UPDATE },
    { key: "view", title: "More Info", type: HeaderType.SPECIAL },
    { key: "password", title: "Change Password", type: HeaderType.UPDATE },
    { key: "edit", title: "Edit", type: HeaderType.UPDATE },
    { key: "delete", title: "Delete", type: HeaderType.DELETE }
  ];

  // on load
  const action = React.useCallback(async () => {
    const result = await getServerData(
      `query { users(filter: {showDisabled: true, keyword: "${keyword}"}) { id user userRoles { role { name } } center { name } isDisabled }}`
    );
    setAdmins(result.data.users);
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
      <Button variant="contained" className="inline-button" endIcon={<Language />}>
        <Link to={"/centers"}>Centers</Link>
      </Button>
      <ContentTable
        name="backend user"
        headers={tableHeader}
        canCreate={privileges.createAdmin}
        canDelete={privileges.deleteAdmin}
        canRead={privileges.readAdmin}
        canUpdate={privileges.updateAdmin}
        hasSnColumn={true}
        addNewLink="/add-admin"
        isAddNewRight={true}
        data={admins.map((admin) => ({
          user: admin.user,
          role: admin.userRoles.map(userRole => userRole.role.name).join(", ").toLowerCase().replace("_", " "),
          center: admin.center?.name ?? "-",
          isDisabled: (
            <Management
              type={ManagementType.switch}
              operation={Operation.update}
              command={`mutation { updateUser(id: ${admin.id}, input: {isDisabled: ${!admin.isDisabled}})  {id}}`}
              initialValue={admin.isDisabled}
              onUpdate={action}
            />
          ),
          view: (
            <Button variant="text" color="info" onClick={() => setViewId(admin.id)}>
              <Visibility />
            </Button>
          ),
          password: (
            <Button variant="text" color="secondary" onClick={() => setPasswordId(admin.id)}>
              <LockReset />
            </Button>
          ),
          edit: (
            <Button variant="text" color="success" onClick={() => setEditId(admin.id)}>
              <Edit />
            </Button>
          ),
          delete: (
            <Management
              type={ManagementType.button}
              operation={Operation.delete}
              command={`mutation { deleteUser(id: ${admin.id})  {id}}`}
              hasConfirmModal={true}
              onUpdate={action}
            />
          )
        }))}
      />
      <Modal open={passwordId !== 0} onClose={() => setPasswordId(0)}>
        <div className="modal">
          <Password id={passwordId} onUpdate={() => action()} />
        </div>
      </Modal>
      <Modal open={editId !== 0} onClose={() => setEditId(0)}>
        <div className="modal">
          <AdminForm id={editId} onUpdate={() => action()} />
        </div>
      </Modal>
      <Modal open={viewId !== 0} onClose={() => setViewId(0)}>
        <div className="modal">
          <AdminView id={viewId} />
        </div>
      </Modal>
    </div>
  );
};

export default Admins;
