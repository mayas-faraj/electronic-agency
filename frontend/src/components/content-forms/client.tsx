import React, { FunctionComponent } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import ContentForm, { reducer } from "../content-form";

const initialInfo = {
  phone: "",
  phone2: "",
  address: "",
  address2: "",
  company: "",
  email: "",
  firstName: "",
  lastName: "",
  namePrefix: ""
};

interface IClientProps {
  onUpdate?: () => void;
}

const Client: FunctionComponent<IClientProps> = ({ onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // process form type (create or update)
  const clientCommand = `mutation { createClient(input: {phone: "${info.phone}", phone2: "${info.phone2}", address: "${info.address}", address2: "${info.address2}", company: "${info.company}", email: "${info.email}", firstName: "${info.firstName}", lastName: "${info.lastName}", , namePrefix: "${info.namePrefix}"}) {id  }}`;

  // load data function
  const action = async () => {
    dispatch({ type: "set", key: "phone", value: initialInfo.phone });
    dispatch({ type: "set", key: "phone2", value: initialInfo.phone2 });
    dispatch({ type: "set", key: "address", value: initialInfo.address });
    dispatch({ type: "set", key: "address2", value: initialInfo.address2 });
    dispatch({ type: "set", key: "company", value: initialInfo.company });
    dispatch({ type: "set", key: "email", value: initialInfo.email });
    dispatch({ type: "set", key: "firstName", value: initialInfo.firstName });
    dispatch({ type: "set", key: "lastName", value: initialInfo.lastName });
    dispatch({ type: "set", key: "namePrefix", value: initialInfo.namePrefix });

    if (onUpdate != null) onUpdate();
  };

  // id edit form, load data
  React.useEffect(() => {
    action();
  }, []);

  // render component
  return (
    <ContentForm
      name="client"
      title="Create New Client"
      command={clientCommand}
      commandDisabled={info.phone === "" || info.email === ""}
      onUpdate={() => action()}
    >
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Client Phone"
          value={info.phone}
          onChange={(e) => dispatch({ type: "set", key: "phone", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Client Secondary Phone (Optional)"
          value={info.phone2}
          onChange={(e) => dispatch({ type: "set", key: "phone2", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Email"
          value={info.email}
          onChange={(e) => dispatch({ type: "set", key: "email", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Address"
          value={info.address}
          onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Secondary Address"
          value={info.address2}
          onChange={(e) => dispatch({ type: "set", key: "address2", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Company"
          value={info.company}
          onChange={(e) => dispatch({ type: "set", key: "company", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="name-prefix">Name Prefix</InputLabel>
        <Select
          labelId="name-prefix"
          variant="outlined"
          label="Name Prefix"
          defaultValue={info.namePrefix}
          value={info.namePrefix}
          onChange={(e) => dispatch({ type: "set", key: "namePrefix", value: e.target.value })}
        >
          <MenuItem value="Mr">Mr</MenuItem>
          <MenuItem value="Ms">Ms</MenuItem>
          <MenuItem value="Mrs">Mrs</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="First Name"
          value={info.firstName}
          onChange={(e) => dispatch({ type: "set", key: "firstName", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          label="Last Name"
          value={info.lastName}
          onChange={(e) => dispatch({ type: "set", key: "lastName", value: e.target.value })}
        />
      </FormControl>
    </ContentForm>
  );
};

export default Client;
