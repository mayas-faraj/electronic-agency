import React, { FunctionComponent } from "react";
import { FormControl, TextField, Button, Modal } from "@mui/material";
import { PermContactCalendar, LocalOffer, ReceiptLong } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ClientSelect from "../content-tables/clients";
import ProductSelect from "../content-tables/products";
import ProductView from "../views/product";
import Receipt from "./receipt";

const initialInfo = {
  orderId: 0,
  count: 0,
  totalPrice: 0,
  address: "",
  note: "",
  productId: 0,
  clientId: 0,
  email: ""
};

interface IOrderProps {
  onUpdate?: () => void;
}

const Order: FunctionComponent<IOrderProps> = ({ onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [viewProduct, setViewProduct] = React.useState(false);
  const [selectProduct, setSelectProduct] = React.useState(false);
  const [viewReceipt, setViewReceipt] = React.useState(false);

  // process form type (create or update)
  const orderCommand = `mutation { createOrder(clientId: ${info.clientId}, input: {productId: ${info.productId}, count: ${parseInt(
    info.count as string
  )}, totalPrice: ${parseInt(info.totalPrice as string)}, address: "${info.address}", note: "${info.note}"}) { id status } }`;

  const handleSelectClient = (clientId: number, email: string) => {
    dispatch({ type: "set", key: "clientId", value: clientId });
    dispatch({ type: "set", key: "email", value: email });
    setSelectClient(false);
  };

  const handleSelectProduct = (productId: number) => {
    dispatch({ type: "set", key: "productId", value: productId });
    setSelectProduct(false);
  };

  const handleSave = (result: any) => {
    if (result?.data?.createOrder?.id != null) dispatch({ type: "set", key: "orderId", value: result.data.createOrder.id });
    // dispatch({ type: "set", key: "note", value: initialInfo.note });
    // dispatch({ type: "set", key: "address", value: initialInfo.address });
    // dispatch({ type: "set", key: "count", value: initialInfo.count });
    // dispatch({ type: "set", key: "totalPrice", value: initialInfo.totalPrice });
    // dispatch({ type: "set", key: "clientId", value: initialInfo.clientId });
    // dispatch({ type: "set", key: "productId", value: initialInfo.productId });
    // dispatch({ type: "set", key: "email", value: initialInfo.email });
  };

  // render component
  return (
    <ContentForm name="order" title="Order Info" command={orderCommand} onUpdate={(result) => handleSave(result)}>
      <div className="row-flex">
        <Button variant="contained" color="primary" onClick={() => setSelectClient(true)}>
          <PermContactCalendar /> Select Client
        </Button>
        <Button variant="contained" color="primary" onClick={() => setSelectProduct(true)}>
          <LocalOffer /> Select Product
        </Button>
      </div>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          multiline={true}
          rows={5}
          label="Client Address"
          value={info.address}
          onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value })}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          multiline={true}
          rows={5}
          label="Client Note"
          value={info.note}
          onChange={(e) => dispatch({ type: "set", key: "note", value: e.target.value })}
        />
      </FormControl>
      <div className="column-double">
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            label="Count"
            value={info.count}
            onChange={(e) => dispatch({ type: "set", key: "count", value: e.target.value })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            label="Total price"
            value={info.totalPrice}
            onChange={(e) => dispatch({ type: "set", key: "totalPrice", value: e.target.value })}
          />
        </FormControl>
      </div>
      <div className="row-flex">
        <Button variant="contained" color="primary" disabled={info.clientId === 0} onClick={() => setViewClient(true)}>
          <PermContactCalendar /> User Info
        </Button>
        <Button variant="contained" color="primary" disabled={info.productId === 0} onClick={() => setViewProduct(true)}>
          <LocalOffer /> Product Info
        </Button>
        <Button variant="contained" color="primary" disabled={info.orderId === 0} onClick={() => setViewReceipt(true)}>
          <ReceiptLong /> View Receipt
        </Button>
      </div>
      <Modal open={selectClient} onClose={() => setSelectClient(false)}>
        <div className="modal">
          <ClientSelect isSelectable={true} onUpdate={(clientId, email) => handleSelectClient(clientId, email)} />
        </div>
      </Modal>
      <Modal open={selectProduct} onClose={() => setSelectProduct(false)}>
        <div className="modal">
          <ProductSelect isSelectable={true} onUpdate={(productId) => handleSelectProduct(productId)} />
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
      <Modal open={viewReceipt} onClose={() => setViewReceipt(false)}>
        <div className="modal">
          <Receipt id={info.orderId as number} />
        </div>
      </Modal>
    </ContentForm>
  );
};

export default Order;
