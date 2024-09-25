import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Language } from "@mui/icons-material";
import CenterForm from "../content-forms/center";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import ProfileContext from "../profile-context";
import { Link } from "react-router-dom";

// types
interface ICenter {
  id: number;
  name: string;
}

// main component
const Centers: FunctionComponent<{ parentId: number }> = ({ parentId }) => {
  // center state
  const [centers, setCenters] = React.useState<ICenter[]>([]);
  const [editId, setEditId] = React.useState(0);

  // context
  const profile = React.useContext(ProfileContext);

  // center schema
  const tableHeader: ITableHeader[] = [
    { key: "name", title: "Name" },
    { key: "subcenter", title: "Subcenters", type: HeaderType.SPECIAL },
    { key: "edit", title: "Edit", type: HeaderType.UPDATE },
    { key: "delete", title: "Delete", type: HeaderType.DELETE }
  ];

  // on load
  const action = async () => {
    const result = await getServerData(`query { centers(parentId: ${parentId !== 0 ? parentId : "null"}) { id name }}`);
    setCenters(result.data.centers);
  };

  React.useEffect(() => {
    action();
  }, [parentId]);

  // render
  return (
    <div>
      <ContentTable
        name="center"
        headers={tableHeader}
        addNewLink={`/add-center${parentId !== 0 ? `/${parentId}` : ""}`}
        canCreate={profile.privileges.createAdmin}
        canDelete={profile.privileges.deleteAdmin}
        canRead={profile.privileges.readAdmin}
        canUpdate={profile.privileges.updateAdmin}
        data={centers.map((center) => ({
          name: center.name,
          subcenter: (
            <Button variant="text" color="primary">
              <Link to={`/centers/${center.id}`}>
                <Language />
              </Link>
            </Button>
          ),
          edit: (
            <Button variant="text" color="success" onClick={() => setEditId(center.id)}>
              <EditIcon />
            </Button>
          ),
          delete: (
            <Management
              onUpdate={() => action()}
              type={ManagementType.button}
              hasConfirmModal={true}
              operation={Operation.delete}
              command={`mutation { deleteCenter(id: ${center.id})  {id name}}`}
            />
          )
        }))}
      />
      <Modal open={editId !== 0} onClose={() => setEditId(0)}>
        <div className="modal">
          <CenterForm id={editId} onUpdate={() => action()} />
        </div>
      </Modal>
    </div>
  );
};

export default Centers;
