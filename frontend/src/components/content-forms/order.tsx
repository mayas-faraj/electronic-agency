import React, { FunctionComponent } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Button,
  Modal,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { PermContactCalendar, ReceiptLong, Delete, AddCircle } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ClientSelect from "../content-tables/clients";
import ProductSelect from "../content-tables/products";
import Receipt from "./receipt";
import getServerData from "../../libs/server-data";
import data from "../../data.json";

const initialInfo = {
  orderId: 0,
  address: "",
  note: "",
  company: "",
  delivery: "",
  warranty: "",
  terms: "",
  status: "",
  isOfferRequest: false,
  offerId: 0,
  offerPrice: "0",
  validationDays: "1",
  clientId: 0,
  clientEmail: "",
  clientPhone: ""
};

type OrderProduct = {
  product: {
    id: number;
    name: string;
    model: string;
    image: string;
  };
  count: number;
  price: number;
};

interface IOrderProps {
  id?: number;
  onUpdate?: () => void;
}

const statuses = ["PENDING", "REJECTED", "ACCEPTED", "CLOSED"];

const Order: FunctionComponent<IOrderProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [selectProduct, setSelectProduct] = React.useState(false);
  const [viewReceipt, setViewReceipt] = React.useState(false);
  const [viewReceiptAr, setViewReceiptAr] = React.useState(false);
  const [products, setProducts] = React.useState<OrderProduct[]>([]);

  // process form type (create or update)
  const orderCommand =
    id !== undefined
      ? `mutation { updateOrderStatus(id: ${id}, status: "${info.status}") { id status } }`
      : `mutation { createOrder(clientId: ${info.clientId}, input: {address: "${info.address}", note: "${info.note}", company: "${
          info.company
        }", delivery: "${info.delivery}", warranty: "${info.warranty}", terms: "${info.terms}", products: [${products.map(
          (orderProduct) => `{
          productId: ${orderProduct.product.id},
          count: ${orderProduct.count},
          price: ${orderProduct.price}
        }`
        )}]}) { id status } }`;

  const handleSelectClient = (clientId: number, clientEmail: string, clientPhone: string) => {
    dispatch({ type: "set", key: "clientId", value: clientId });
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: clientPhone });
    setSelectClient(false);
  };

  const handleSelectProduct = (productId: number, name: string, image: string, price: number, count: number) => {
    setProducts([...products, { product: { id: productId, name, image, model: "" }, price, count }]);
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

    if (onUpdate !== undefined) onUpdate();
  };

  // on load
  React.useEffect(() => {
    const loadOrder = async () => {
      const result = await getServerData(
        `query { order(id: ${id}) { id address note status company warranty delivery terms createdAt products { price count product { name image nameTranslated model } } client { id phone email } offer { id price validationDays } } }`
      );

      dispatch({ type: "set", key: "clientId", value: result.data.order.client.id });
      dispatch({ type: "set", key: "clientPhone", value: result.data.order.client.phone });
      dispatch({ type: "set", key: "clientEmail", value: result.data.order.client.email });
      dispatch({ type: "set", key: "createdAt", value: result.data.order.createdAt });
      dispatch({ type: "set", key: "address", value: result.data.order.address });
      dispatch({ type: "set", key: "note", value: result.data.order.note });
      dispatch({ type: "set", key: "company", value: result.data.order.company });
      dispatch({ type: "set", key: "delivery", value: result.data.order.delivery });
      dispatch({ type: "set", key: "warranty", value: result.data.order.warranty });
      dispatch({ type: "set", key: "terms", value: result.data.order.terms });
      dispatch({ type: "set", key: "offerPrice", value: result.data.order.offer?.price ?? 0 });
      dispatch({ type: "set", key: "validationDays", value: result.data.order.offer?.validationDays ?? 1 });
      dispatch({ type: "set", key: "status", value: result.data.order.status });
      setProducts(result.data.order.products);
    };
    if (id !== undefined) loadOrder();
  }, [id]);

  // render component
  return (
    <ContentForm
      id={id}
      name="order"
      title="Order Info"
      command={orderCommand}
      onUpdate={(result) => handleSave(result)}
      commandDisabled={id === undefined && (info.orderId !== 0 || products.length === 0 || info.clientId === 0)}
    >
      {id !== undefined && <h2 className="subtitle">Order :{id.toString()}</h2>}
      <div className="column-double">
        {id === undefined && (
          <Button fullWidth variant="contained" color="primary" onClick={() => setSelectClient(true)}>
            <PermContactCalendar />
            {info.clientPhone === "" ? "Select Client" : `Update Client: ${info.clientPhone} [${info.clientEmail}]`}
          </Button>
        )}
        {id !== undefined && (
          <Button fullWidth variant="contained" color="primary" onClick={() => setViewClient(true)}>
            <PermContactCalendar />
            {info.clientPhone as string}
          </Button>
        )}
        <TextField
          variant="outlined"
          InputProps={{ readOnly: id !== undefined }}
          label="Client Address"
          value={info.address}
          onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value })}
        />
      </div>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table className="normal-table">
          <TableHead>
            <TableRow>
              <TableCell>product image</TableCell>
              <TableCell>name</TableCell>
              <TableCell>count</TableCell>
              <TableCell>price</TableCell>
              {id === undefined && (
                <TableCell width={95}>
                  <Button variant="text" onClick={() => setSelectProduct(true)}>
                    <AddCircle color="primary" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((orderProduct, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img src={`${data["site-url"]}${orderProduct.product.image}`} alt={orderProduct.product.name} />
                </TableCell>
                <TableCell>{orderProduct.product.name}</TableCell>
                <TableCell>{orderProduct.count}</TableCell>
                <TableCell>{orderProduct.price}</TableCell>
                {id === undefined && (
                  <TableCell>
                    <Button variant="text" onClick={() => setProducts(products.filter((product, productIndex) => index !== productIndex))}>
                      <Delete color="error" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          InputProps={{ readOnly: id !== undefined }}
          label="Total price"
          value={products.reduce((acc, orderProduct) => acc + orderProduct.price * orderProduct.count, 0)}
        />
      </FormControl>
      <div className="column-double">
        <div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="offer price"
              value={info.offerPrice}
              type="number"
              onChange={(e) => dispatch({ type: "set", key: "offerPrice", value: e.target.value })}
              InputProps={{ readOnly: id !== undefined }}
              inputProps={{ min: 0 }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="company"
              value={info.company}
              InputProps={{ readOnly: id !== undefined }}
              onChange={(e) => dispatch({ type: "set", key: "company", value: e.target.value })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="warranty"
              value={info.warranty}
              InputProps={{ readOnly: id !== undefined }}
              onChange={(e) => dispatch({ type: "set", key: "warranty", value: e.target.value })}
            />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="validation days"
              value={info.validationDays}
              type="number"
              onChange={(e) => dispatch({ type: "set", key: "validationDays", value: e.target.value })}
              InputProps={{ readOnly: id !== undefined }}
              inputProps={{ min: 0 }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="terms"
              value={info.terms}
              onChange={(e) => dispatch({ type: "set", key: "terms", value: e.target.value })}
              InputProps={{ readOnly: id !== undefined }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="delivery"
              value={info.delivery}
              onChange={(e) => dispatch({ type: "set", key: "delivery", value: e.target.value })}
              InputProps={{ readOnly: id !== undefined }}
            />
          </FormControl>
        </div>
      </div>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          InputProps={{ readOnly: id !== undefined }}
          multiline={true}
          rows={5}
          label="Note"
          value={info.note}
          onChange={(e) => dispatch({ type: "set", key: "note", value: e.target.value })}
        />
      </FormControl>
      {id !== undefined && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Status</InputLabel>
          <Select
            labelId="role-label"
            variant="outlined"
            label="Status"
            defaultValue={info.status}
            value={info.status}
            onChange={(e) => dispatch({ type: "set", key: "status", value: e.target.value })}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.toLowerCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <div className="row-flex">
        <Button variant="contained" color="primary" disabled={info.orderId === 0 && id === undefined} onClick={() => setViewReceipt(true)}>
          <ReceiptLong /> View Receipt
        </Button>
        <Button variant="contained" color="primary" disabled={info.orderId === 0 && id === undefined} onClick={() => setViewReceiptAr(true)}>
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
          <ProductSelect
            isSelectable={true}
            onUpdate={(productId, name, image, price, count) => handleSelectProduct(productId, name, image, price, count)}
          />
        </div>
      </Modal>
      <Modal open={viewClient} onClose={() => setViewClient(false)}>
        <div className="modal">
          <ClientView id={Number(info.clientId)} />
        </div>
      </Modal>
      <Modal open={viewReceipt} onClose={() => setViewReceipt(false)}>
        <div className="modal">
          <Receipt id={info.orderId as number} />
        </div>
      </Modal>
      {(id !== undefined || info.orderId !== 0) && (
        <Modal open={viewReceiptAr} onClose={() => setViewReceiptAr(false)}>
          <div className="modal">
            <Receipt id={id ?? (info.orderId as number)} isArabic={true} />
          </div>
        </Modal>
      )}
      {(id !== undefined || info.orderId !== 0) && (
        <Modal open={viewReceipt} onClose={() => setViewReceipt(false)}>
          <div className="modal">
            <Receipt id={id ?? (info.orderId as number)} />
          </div>
        </Modal>
      )}
    </ContentForm>
  );
};

export default Order;
