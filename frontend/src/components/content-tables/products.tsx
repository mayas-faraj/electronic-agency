import React, { FunctionComponent } from "react";
import { Button, FormControl, InputAdornment, Modal, TextField } from "@mui/material";
import { Abc, AddCircle, CheckCircle, Search, Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { ITableHeader } from "../content-table";
import ProductItems from "../content-tables/product-item";
import ProductForm from "../content-forms/product";
import ProductView from "../views/product";
import data from "../../data.json";
import RoleContext from "../role-context";
import getServerData from "../../libs/server-data";

// types
interface IProduct {
  id: number;
  name: string;
  model: string;
  image?: string;
  description?: string;
  price: number | null;
  isDisabled: boolean;
  createdAt: Date;
}
interface IProductsType {
  isSelectable?: boolean;
  isSelectCountPrice?: boolean;
  onUpdate?: (id: number, name: string, image: string, price: number, count: number) => void;
}

// main component
const Products: FunctionComponent<IProductsType> = ({ isSelectable, isSelectCountPrice, onUpdate }) => {
  // product state
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [editId, setEditId] = React.useState(0);
  const [viewId, setViewId] = React.useState(0);
  const [selectProduct, setSelectProduct] = React.useState<IProduct | null>(null);
  const [manageItemId, setManageItemId] = React.useState(0);
  const [keyword, setKeyword] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [count, setCount] = React.useState(1);

  // context
  const privileges = React.useContext(RoleContext);

  // product schema
  const tableHeader: ITableHeader[] = [
    { key: "image", title: "Image", isSpecialType: true },
    { key: "name", title: "Name" },
    { key: "model", title: "Model" },
    { key: "view", title: "More Info", isSpecialType: true }
  ];

  if (isSelectable) tableHeader.push({ key: "select", title: "select" });
  else {
    tableHeader.push(
      { key: "isDisabled", title: "Disable", isControlType: true },
      { key: "item", title: "Manage SN", isControlType: true },
      { key: "edit", title: "Edit", isControlType: true },
      { key: "delete", title: "Delete", isControlType: true }
    );
  }

  // on load
  const action = React.useCallback(async () => {
    const result = await getServerData(
      `query { products(filter: {showDisabled: true, keyword: "${keyword}"}) { id name model image description price isDisabled }}`
    );
    setProducts(result.data.products);
  }, [keyword]);

  // event handler
  React.useEffect(() => {
    action();
  }, [action]);

  const handleSelectProduct = (product: IProduct) => {
    setProducts([product]);
    setPrice(product.price ?? 0);
    setSelectProduct(product);
  };

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
        name="product"
        headers={tableHeader}
        canRead={privileges.readProduct}
        canWrite={privileges.writeProduct}
        hasSnColumn={true}
        addNewLink={!isSelectable ? "/add-product" : undefined}
        isAddNewRight={true}
        data={products.map((product) => ({
          image: <img src={data["site-url"] + product.image} alt={product.name} />,
          name: product.name,
          model: product.model,
          isDisabled:
            isSelectable !== true ? (
              <Management
                type={ManagementType.switch}
                operation={Operation.update}
                command={`mutation { updateProduct(id: ${product.id}, input: {isDisabled: ${!product.isDisabled}})  {id name model}}`}
                initialValue={product.isDisabled}
                onUpdate={action}
              />
            ) : undefined,
          view: (
            <Button variant="text" color="info" onClick={() => setViewId(product.id)}>
              <Visibility />
            </Button>
          ),
          item:
            isSelectable !== true ? (
              <Button variant="text" color="info" onClick={() => setManageItemId(product.id)}>
                <Abc />
              </Button>
            ) : undefined,
          edit:
            isSelectable !== true ? (
              <Button variant="text" color="success" onClick={() => setEditId(product.id)}>
                <EditIcon />
              </Button>
            ) : undefined,
          delete:
            isSelectable !== true ? (
              <Management
                type={ManagementType.button}
                operation={Operation.delete}
                command={`mutation { deleteProduct(id: ${product.id})  {id name model}}`}
                hasConfirmModal={true}
                onUpdate={action}
              />
            ) : undefined,
          select: isSelectable ? (
            <Button variant="text" color="info" disabled={selectProduct !== null} onClick={() => handleSelectProduct(product)}>
              <CheckCircle />
            </Button>
          ) : undefined
        }))}
      />
      {selectProduct !== null && onUpdate !== undefined && (
        <>
          {isSelectCountPrice && (
            <div className="column-double">
              <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="count" value={count} type="number" onChange={(e) => setCount(parseInt(e.target.value))} />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField variant="outlined" label="price" value={price} type="number" onChange={(e) => setPrice(parseInt(e.target.value))} />
              </FormControl>
            </div>
          )}
          <FormControl fullWidth margin="normal">
            <Button variant="contained" onClick={() => onUpdate(selectProduct.id, selectProduct.name, selectProduct.image ?? "", price, count)}>
              <AddCircle /> Add Selected Product
            </Button>
          </FormControl>
        </>
      )}
      <Modal open={editId !== 0} onClose={() => setEditId(0)}>
        <div className="modal">
          <ProductForm id={editId} onUpdate={() => action()} />
        </div>
      </Modal>
      <Modal open={viewId !== 0} onClose={() => setViewId(0)}>
        <div className="modal">
          <ProductView id={viewId} />
        </div>
      </Modal>
      <Modal open={manageItemId !== 0} onClose={() => setManageItemId(0)}>
        <div className="modal">
          <ProductItems productId={manageItemId} />
        </div>
      </Modal>
    </div>
  );
};

export default Products;
