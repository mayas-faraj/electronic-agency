import React, { FunctionComponent } from "react";
import { FormControl, Select, TextField, MenuItem, InputLabel } from "@mui/material";
import ContentForm, { reducer } from "../content-form";
import getServerData from "../../libs/server-data";

const initialInfo = {
  name: "",
  parentId: 0
};

interface ICenterProps {
  id?: number;
  parentId?: number;
  onUpdate?: () => void;
}

interface ICenter {
  id: number;
  name: string;
}

const Center: FunctionComponent<ICenterProps> = ({ id, parentId, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);
  // component state
  const [centers, setCenters] = React.useState<ICenter[]>([]);

  // process form type (create or update)
  const centerCommand =
    id === undefined
      ? `mutation { createCenter(input: { name: "${(info.name as string).trim()}",parentId: ${info.parentId !== 0 ? info.parentId : null} }) { id name } }`
      : `mutation { updateCenter(id: ${id}, input: { name: "${(info.name as string).trim()}",parentId: ${info.parentId !== 0 ? info.parentId : null} }) { id name } }`;

  // load data function
  const action = async () => {
    if (id !== undefined) {
      const result = await getServerData(`query { center(id: ${id}) { id name parentId } }`);
      dispatch({ type: "set", key: "name", value: result.data.center.name });
      dispatch({ type: "set", key: "parentId", value: result.data.center.parentId });
    } else {
      dispatch({ type: "set", key: "name", value: initialInfo.name });
      dispatch({ type: "set", key: "parentId", value: initialInfo.parentId });
    }

    if (onUpdate != null) onUpdate();
  };

  // id edit form, load data
  React.useEffect(() => {
    const action = async () => {
      if (id !== undefined) {
        const result = await getServerData(`query { center(id: ${id}) { name parentId } }`);
        dispatch({ type: "set", key: "name", value: result.data.center.name });
        dispatch({ type: "set", key: "parentId", value: result.data.center.parentId });
      }

      const centersResponse = await getServerData(`query { centers { id name } }`);
      setCenters(centersResponse.data.centers);
    };
    action();
  }, [id]);

  React.useEffect(() => {
    if (parentId !== undefined) dispatch({ type: "set", key: "parentId", value: parentId });
  }, [parentId]);

  // render component
  return (
    <ContentForm
      id={id}
      name="center"
      title="Create new center"
      command={centerCommand}
      commandDisabled={info.name === ""}
      onUpdate={() => action()}
    >
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Center name"
          value={info.name}
          onChange={(e) => dispatch({ type: "set", key: "name", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="parent-label">Parent City</InputLabel>
        <Select
          labelId="parent-label"
          variant="outlined"
          label="Parent City"
          value={info.parentId as number}
          onChange={(e) => dispatch({ type: "set", key: "parentId", value: e.target.value })}
        >
          <MenuItem value={0}>(Top Center)</MenuItem>
          {centers.map((center) => (
            <MenuItem value={center.id}>{center.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </ContentForm>
  );
};

export default Center;
