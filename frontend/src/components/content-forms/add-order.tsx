import React, { FunctionComponent } from "react";
import { FormControl, TextField, Button, Modal } from "@mui/material";
import { PermContactCalendar, LocalOffer, ReceiptLong } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ClientSelect from "../content-tables/clients";
import ProductSelect from "../content-tables/products";
import ProductView from "../views/product";
import Receipt from "./receipt";
import data from "../../data.json";
import getServerData from "../../libs/server-data";

const initialInfo = {
  orderId: 0,
  count: "1",
  totalPrice: "0",
  address: "",
  note: "",
  productId: 0,
  productName: "",
  productPrice: "0",
  productImage: "",
  offerPrice: "0",
  validationDays: "1",
  clientId: 0,
  clientEmail: "",
  clientPhone: ""
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
  const [viewReceiptAr, setViewReceiptAr] = React.useState(false);

  // process form type (create or update)
  const orderCommand = `mutation { createOrder(clientId: ${info.clientId}, input: {productId: ${info.productId}, count: ${parseInt(
    info.count as string
  )}, totalPrice: ${parseInt(info.totalPrice as string)}, address: "${info.address}", note: "${info.note}", isOfferRequest: true}) { id status } }`;

  const handleSelectClient = (clientId: number, clientEmail: string, clientPhone: string) => {
    dispatch({ type: "set", key: "clientId", value: clientId });
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: clientPhone });
    setSelectClient(false);
  };

  const handleSelectProduct = (productId: number, name: string, price: number | null, image?: string) => {
    dispatch({ type: "set", key: "productId", value: productId });
    dispatch({ type: "set", key: "productName", value: name });
    dispatch({ type: "set", key: "productPrice", value: price ?? 0 });
    dispatch({ type: "set", key: "offerPrice", value: price ?? 0 });
    dispatch({ type: "set", key: "productImage", value: image ?? "" });
    console.log(name, price);
    setSelectProduct(false);
  };

  const handleSave = async (result: any) => {
    if (result?.data?.createOrder?.id != null) {
      dispatch({ type: "set", key: "orderId", value: result.data.createOrder.id });
      await getServerData(
        `mutation { createOfferByAuth(input: {orderId: ${result.data.createOrder.id}, price: ${parseInt(
          info.offerPrice as string
        )}, validationDays: ${parseInt(info.validationDays as string)}}) { id } }`
      );
    }
    // dispatch({ type: "set", key: "note", value: initialInfo.note });
    // dispatch({ type: "set", key: "address", value: initialInfo.address });
    // dispatch({ type: "set", key: "count", value: initialInfo.count });
    // dispatch({ type: "set", key: "totalPrice", value: initialInfo.totalPrice });
    // dispatch({ type: "set", key: "clientId", value: initialInfo.clientId });
    // dispatch({ type: "set", key: "productId", value: initialInfo.productId });
    // dispatch({ type: "set", key: "productName", value: initialInfo.productName });
    // dispatch({ type: "set", key: "productPrice", value: initialInfo.productPrice });
    // dispatch({ type: "set", key: "productImage", value: initialInfo.productImage });
    // dispatch({ type: "set", key: "clientEmail", value: initialInfo.clientEmail });
    // dispatch({ type: "set", key: "clientPhone", value: initialInfo.clientPhone });
  };

  // render component
  return (
    <ContentForm
      name="order"
      title="Order Info"
      command={orderCommand}
      onUpdate={(result) => handleSave(result)}
      commandDisabled={info.productId === 0 || info.clientId === 0 || parseInt(info.offerPrice as string) === 0}
    >
      <div className="column-one-tow">
        <div>
          <FormControl fullWidth margin="normal">
            <Button fullWidth variant="contained" color="primary" onClick={() => setSelectClient(true)}>
              <PermContactCalendar /> Select Client
            </Button>
          </FormControl>
          {info.clientEmail !== "" && (
            <FormControl fullWidth margin="normal">
              <TextField variant="outlined" label="client email" value={info.clientEmail} inputProps={{ readonly: true }} />
            </FormControl>
          )}
          {info.clientPhone !== "" && (
            <FormControl fullWidth margin="normal">
              <TextField variant="outlined" label="client phone" value={info.clientPhone} inputProps={{ readonly: true }} />
            </FormControl>
          )}
          <FormControl fullWidth margin="normal">
            <Button fullWidth variant="contained" color="primary" onClick={() => setSelectProduct(true)}>
              <LocalOffer /> Select Product
            </Button>
          </FormControl>
          {info.productName && (
            <FormControl fullWidth margin="normal">
              <TextField variant="outlined" label="product name" value={info.productName} inputProps={{ readonly: true }} />
            </FormControl>
          )}
          {info.productImage && <img src={data["site-url"] + info.productImage} alt={info.productName as string} />}
        </div>
        <div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              multiline={true}
              rows={3}
              label="Client Address"
              value={info.address}
              onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              multiline={true}
              rows={3}
              label="Client Note"
              value={info.note}
              onChange={(e) => dispatch({ type: "set", key: "note", value: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Count"
              value={info.count}
              type="number"
              onChange={(e) => dispatch({ type: "set", key: "count", value: e.target.value })}
            />
          </FormControl>
          {info.productPrice !== 0 && (
            <div className="column-double">
              <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="price" value={info.productPrice} type="number" inputProps={{ readonly: true }} />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  variant="outlined"
                  label="Total price"
                  type="number"
                  value={(info.productPrice as number) * parseInt(info.count as string) ?? "0"}
                  inputProps={{ readonly: true }}
                />
              </FormControl>
            </div>
          )}
          <div className="column-double">
            <FormControl fullWidth margin="normal">
              <TextField
                variant="outlined"
                label="offer price"
                value={info.offerPrice}
                type="number"
                onChange={(e) => dispatch({ type: "set", key: "offerPrice", value: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                variant="outlined"
                label="Total offer price"
                type="number"
                value={(info.offerPrice as number) * parseInt(info.count as string) ?? "0"}
                inputProps={{ readonly: true }}
              />
            </FormControl>
          </div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="validation days"
              value={info.validationDays}
              type="number"
              onChange={(e) => dispatch({ type: "set", key: "validationDays", value: e.target.value })}
            />
          </FormControl>
        </div>
      </div>
      <div className="row-flex">
        <Button variant="contained" color="primary" disabled={info.orderId === 0} onClick={() => setViewReceipt(true)}>
          <ReceiptLong /> View Receipt (English)
        </Button>
        <Button variant="contained" color="primary" disabled={info.orderId === 0} onClick={() => setViewReceiptAr(true)}>
          <ReceiptLong /> View Receipt (Arabic)
        </Button>
      </div>
      <Modal open={selectClient} onClose={() => setSelectClient(false)}>
        <div className="modal">
          <ClientSelect
            isSelectable={true}
            onUpdate={(clientId, clientEmail, clientPhone) => handleSelectClient(clientId, clientEmail, clientPhone)}
          />
        </div>
      </Modal>
      <Modal open={selectProduct} onClose={() => setSelectProduct(false)}>
        <div className="modal">
          <ProductSelect isSelectable={true} onUpdate={(productId, name, price, image) => handleSelectProduct(productId, name, price, image)} />
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
      <Modal open={viewReceiptAr} onClose={() => setViewReceiptAr(false)}>
        <div className="modal">
          <Receipt id={info.orderId as number} isArabic={true} />
        </div>
      </Modal>
    </ContentForm>
  );
};

export default Order;
