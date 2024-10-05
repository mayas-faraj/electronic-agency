/* eslint-disable no-control-regex */
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
  TableBody,
  Box,
  InputAdornment,
  OutlinedInput,
  IconButton
} from "@mui/material";
import { ReceiptLong, Delete, AddCircle, Percent, Numbers } from "@mui/icons-material";
import ContentForm, { reducer } from "../content-form";
import ClientView from "../views/client";
import ClientSelect from "../content-tables/clients";
import ProductSelect from "../content-tables/products";
import Receipt from "./receipt";
import getServerData from "../../libs/server-data";
import data from "../../data.json";
import ProfileContext from "../profile-context";

const initialInfo = {
  orderId: 0,
  projectNumber: "",
  subject: "",
  address: "",
  note: "",
  company: "",
  delivery: "",
  warranty: "",
  terms: "",
  status: "",
  isOfferRequest: false,
  offerId: 0,
  offerDiscount: "0",
  isDiscountPercent: false,
  validationDays: "1",
  clientUser: "",
  clientEmail: "",
  clientPhone: "",
  clientFirstName: "",
  clientLastName: ""
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

  // component context
  const profile = React.useContext(ProfileContext);

  // component status
  const [viewClient, setViewClient] = React.useState(false);
  const [selectClient, setSelectClient] = React.useState(false);
  const [selectProduct, setSelectProduct] = React.useState(false);
  const [viewReceipt, setViewReceipt] = React.useState(false);
  const [viewReceiptAr, setViewReceiptAr] = React.useState(false);
  const [products, setProducts] = React.useState<OrderProduct[]>([]);

  const totalPrice = products.reduce((acc, orderProduct) => acc + orderProduct.price * orderProduct.count, 0);
  const offerPrice = info.isDiscountPercent ? totalPrice * (1 - parseInt(info.offerDiscount as string) / 100) : totalPrice - parseInt(info.offerDiscount as string);

  // process form type (create or update)
  const orderCommand =
    id !== undefined
      ? `mutation { updateOrderStatus(id: ${id}, status: "${info.status}") { id status } }`
      : `mutation { createOrder(user: "${info.clientUser}", input: {projectNumber: "${info.projectNumber}", subject: "${info.subject}", address: "${info.address}", note: "${(
          info.note as string
        )
          // eslint-disable-next-line no-control-regex
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")}", company: "${info.company}", delivery: "${info.delivery}", warranty: "${info.warranty}", terms: "${
          info.terms
        }", products: [${products.map(
          (orderProduct) => `{
          productId: ${orderProduct.product.id},
          count: ${orderProduct.count},
          price: ${orderProduct.price}
        }`
        )}]}) { id status } }`;

  const handleSelectClient = (
    _: number,
    clientEmail: string,
    clientPhone: string,
    clientUser: string,
    clientFirstName: string,
    clientLastName: string,
    clientCompany: string,
    clientPhone2: string,
    clientAddress: string,
    clientAddress2: string
  ) => {
    dispatch({ type: "set", key: "clientEmail", value: clientEmail });
    dispatch({ type: "set", key: "clientPhone", value: `${clientPhone}${clientPhone2 ? "/" + clientPhone2 : ""}` });
    dispatch({ type: "set", key: "clientUser", value: clientUser });
    dispatch({ type: "set", key: "clientFirstName", value: clientFirstName });
    dispatch({ type: "set", key: "clientLastName", value: clientLastName });
    dispatch({ type: "set", key: "company", value: clientCompany ?? "" });
    dispatch({ type: "set", key: "address", value: `${clientAddress != null ? clientAddress : ""}${clientAddress2 ? "/" + clientAddress2 : ""}` });

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
        `mutation { createOfferByAuth(input: {orderId: ${result.data.createOrder.id}, 
         discount: ${parseInt(info.offerDiscount as string)},
         isDiscountPercent: ${info.isDiscountPercent as boolean},
         validationDays: ${parseInt(info.validationDays as string)}}) { id } }`
      );
    }

    if (onUpdate !== undefined) onUpdate();
  };

  // on load
  React.useEffect(() => {
    const loadOrder = async () => {
      const result = await getServerData(
        `query { order(id: ${id}) { id projectNumber subject address note status company warranty delivery terms createdAt products { price count product { name image nameTranslated model } } client { id user phone phone2 company address address2 email firstName lastName } offer { id discount isDiscountPercent validationDays } } }`
      );

      dispatch({ type: "set", key: "clientUser", value: result.data.order.client.user });
      dispatch({ type: "set", key: "clientPhone", value: result.data.order.client.phone });
      dispatch({ type: "set", key: "clientPhone2", value: result.data.order.client.phone2 });
      dispatch({ type: "set", key: "clientEmail", value: result.data.order.client.email });
      dispatch({ type: "set", key: "clientFirstName", value: result.data.order.client.firstName });
      dispatch({ type: "set", key: "clientLastName", value: result.data.order.client.lastName });
      dispatch({ type: "set", key: "createdAt", value: result.data.order.createdAt });
      dispatch({ type: "set", key: "subject", value: result.data.order.subject });
      dispatch({ type: "set", key: "projectNumber", value: result.data.order.projectNumber });
      dispatch({ type: "set", key: "address", value: result.data.order.address });
      dispatch({ type: "set", key: "note", value: result.data.order.note });
      dispatch({ type: "set", key: "company", value: result.data.order.company });
      dispatch({ type: "set", key: "delivery", value: result.data.order.delivery });
      dispatch({ type: "set", key: "warranty", value: result.data.order.warranty });
      dispatch({ type: "set", key: "terms", value: result.data.order.terms });
      dispatch({ type: "set", key: "offerDiscount", value: result.data.order.offer?.discount ?? 0 });
      dispatch({ type: "set", key: "isDiscountPercent", value: result.data.order.offer?.isDiscountPercent ?? false });
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
      isDisabled={!profile.privileges.updateOrder || !profile.privileges.createOrder}
      commandDisabled={id === undefined && (info.orderId !== 0 || products.length === 0 || info.clientUser === "")}
    >
      {id !== undefined && <h2 className="subtitle">Order :{id.toString()}</h2>}
      <Box component="fieldset">
        <legend>Client</legend>
        {id === undefined && (
          <ClientSelect
            isSelectable={true}
            displayOneRow={true}
            onUpdate={(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, company, phone2, address, address2) =>
              handleSelectClient(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, company, phone2, address, address2)
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
              inputProps={{ maxLength: 500 }}
              label="Client Address"
              value={info.address}
              onChange={(e) => dispatch({ type: "set", key: "address", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
            />
          </FormControl>
        </div>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table className="normal-table">
          <TableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Price (IQD)</TableCell>
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
                <TableCell>{orderProduct.price.toLocaleString()}</TableCell>
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
        <InputLabel htmlFor="total-price">Total Price</InputLabel>
        <OutlinedInput
          id="total-price"
          label="Total Price"
          readOnly={true}
          value={totalPrice.toLocaleString()}
          endAdornment={<InputAdornment position="end">IQD</InputAdornment>}
        />
      </FormControl>
      <div className="column-double">
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="offer-discount">Offer Discount</InputLabel>
          <OutlinedInput
            id="offer-discount"
            label="Offer Discount"
            value={info.offerDiscount}
            type="number"
            onChange={(e) => dispatch({ type: "set", key: "offerDiscount", value: e.target.value })}
            readOnly={id !== undefined}
            inputProps={{ min: 0 }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => dispatch({ type: "set", key: "isDiscountPercent", value: !info.isDiscountPercent })} edge="end" disabled={id !== undefined}>
                  {info.isDiscountPercent ? <Percent /> : <Numbers />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
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
      </div>
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="total-price">Offer Price</InputLabel>
        <OutlinedInput
          id="offer-price"
          label="Offer Price"
          readOnly={true}
          value={!isNaN(offerPrice) ? Math.ceil(offerPrice).toLocaleString() : 0}
          endAdornment={<InputAdornment position="end">IQD</InputAdornment>}
        />
      </FormControl>
      <div className="column-double">
        <div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Project Number"
              value={info.projectNumber}
              InputProps={{ readOnly: id !== undefined }}
              onChange={(e) => dispatch({ type: "set", key: "projectNumber", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Company"
              value={info.company}
              InputProps={{ readOnly: id !== undefined }}
              inputProps={{ maxLength: 100 }}
              onChange={(e) => dispatch({ type: "set", key: "company", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Warranty"
              value={info.warranty}
              InputProps={{ readOnly: id !== undefined }}
              inputProps={{ maxLength: 100 }}
              onChange={(e) => dispatch({ type: "set", key: "warranty", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
            />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Subject"
              value={info.subject}
              InputProps={{ readOnly: id !== undefined }}
              onChange={(e) => dispatch({ type: "set", key: "subject", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Terms"
              value={info.terms}
              onChange={(e) => dispatch({ type: "set", key: "terms", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
              InputProps={{ readOnly: id !== undefined }}
              inputProps={{ maxLength: 500 }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              variant="outlined"
              label="Delivery"
              value={info.delivery}
              onChange={(e) => dispatch({ type: "set", key: "delivery", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
              InputProps={{ readOnly: id !== undefined }}
              inputProps={{ maxLength: 100 }}
            />
          </FormControl>
        </div>
      </div>
      <FormControl fullWidth margin="normal">
        <TextField
          variant="outlined"
          InputProps={{ readOnly: id !== undefined }}
          inputProps={{ maxLength: 2000 }}
          multiline={true}
          rows={5}
          label="Note"
          value={info.note}
          onChange={(e) => dispatch({ type: "set", key: "note", value: e.target.value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "") })}
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
            onUpdate={(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, clientCompany, clientPhone2, clientAddress, clientAddress2) =>
              handleSelectClient(_, clientEmail, clientPhone, clientUser, clientFirstName, clientLastName, clientCompany, clientPhone2, clientAddress, clientAddress2)
            }
          />
        </div>
      </Modal>
      <Modal open={selectProduct} onClose={() => setSelectProduct(false)}>
        <div className="modal">
          <ProductSelect
            isSelectable={true}
            isSelectCountPrice={true}
            onUpdate={(productId, name, image, price, count) => handleSelectProduct(productId, name, image, price, count)}
          />
        </div>
      </Modal>
      <Modal open={viewClient} onClose={() => setViewClient(false)}>
        <div className="modal">
          <ClientView user={info.clientUser as string} />
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
