import React, { FunctionComponent } from "react";
import jsPDF from "jspdf";
import { reducer } from "../content-form";
import logoImage from "../../assets/imgs/logo-receipt.png";
import greeImage from "../../assets/imgs/gree-logo.webp";
import getServerData from "../../libs/server-data";
import styles from "../../styles/receipt.module.scss";
import { CloudDownload, Send } from "@mui/icons-material";
import { Button } from "@mui/material";

const initialInfo = {
  user: "",
  phone: "",
  email: "",
  count: 0,
  offerPrice: 0,
  validationDays: 1,
  address: "",
  note: "",
  productName: "",
  productModel: ""
};

interface IReceiptProps {
  id: number;
  onUpdate?: () => void;
}

const Receipt: FunctionComponent<IReceiptProps> = ({ id, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);

  const print = () => {
    const jsPdf = new jsPDF({
      orientation: "portrait",
      unit: "px"
    });
    jsPdf.html(document.getElementById("print") ?? "no data", {
      x: 20,
      y: 20,
      width: 400,
      windowWidth: 650,
      callback: (doc) => doc.save("receipt.pdf")
    });
  };

  // on load
  React.useEffect(() => {
    const loadReceipt = async () => {
      const result = await getServerData(
        `query { order(id: ${id}) { id count address note createdAt product { id name model } client { id user phone email } offer { id price validationDays } } }`
      );

      dispatch({ type: "set", key: "phone", value: result.data.order.client.phone });
      dispatch({ type: "set", key: "email", value: result.data.order.client.email });
      dispatch({ type: "set", key: "user", value: result.data.order.user });
      dispatch({ type: "set", key: "count", value: result.data.order.count });
      dispatch({ type: "set", key: "createdAt", value: result.data.order.createdAt });
      dispatch({ type: "set", key: "offerPrice", value: result.data.order.offer.price });
      dispatch({ type: "set", key: "validationDays", value: result.data.order.offer.validationDays ?? 1});
      dispatch({ type: "set", key: "address", value: result.data.order.address });
      dispatch({ type: "set", key: "note", value: result.data.order.note });
      dispatch({ type: "set", key: "productName", value: result.data.order.product.name });
      dispatch({ type: "set", key: "OfferPrice", value: result.data.order.product.offer?.price ?? 0 });

      if (onUpdate != null) onUpdate();
    };
    loadReceipt();
  }, [id, onUpdate]);

  // render component
  return (
    <>
      <div className={styles.wrapper} id="print">
        <div>
          <img src={logoImage} alt="logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>Estimate</h1>
        <div className={styles.id}>Estimate #EST-{id}</div>
        <table className={styles.schemaTable}>
          <tr>
            <td>Company name:</td>
            <td>{info.user as string}</td>
            <td></td>
            <td></td>
            <td>Estimate Date:</td>
            <td>{new Date(parseInt(info.createdAt as string)).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Att:</td>
            <td></td>
            <td></td>
            <td></td>
            <td>Expiry Date:</td>
            <td>{new Date(parseInt(info.createdAt as string) + (info.validationDays as number) * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Mobile:</td>
            <td>{info.phone as string}</td>
            <td></td>
            <td></td>
            <td>Reference #</td>
            <td>{id}</td>
          </tr>
        </table>
        <p>We are glad to submit you with commerical price quotation for the products detailed below:</p>
        <table className={styles.productsTable}>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Description</th>
            <th>QTY</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>1</td>
            <td>{info.productName as string}</td>
            <td>{info.productModel as string}</td>
            <td>{info.count as number}</td>
            <td>{info.offerPrice as number}</td>
            <td>{(info.offerPrice as number) * (info.count as number)}</td>
          </tr>
        </table>
        <div className={styles.summary}>
          <table className={styles.summaryTable}>
            <tr>
              <td>Sub total</td>
              <td>{(info.offerPrice as number) * (info.count as number)} $</td>
            </tr>
            <tr>
              <td>Discount:</td>
              <td></td>
            </tr>
            <tr className={styles.strong}>
              <td>Total</td>
              <td>{(info.offerPrice as number) * (info.count as number)} $</td>
            </tr>
          </table>
        </div>
        <div className={styles.notes}>
          <table className={styles.notesTable}>
            <tr>
              <td>Notes</td>
              <td>{info.note as string}</td>
            </tr>
            <tr>
              <td>Payment terms:</td>
              <td></td>
            </tr>
            <tr>
              <td>Delivery:</td>
              <td></td>
            </tr>
            <tr>
              <td>Warranty:</td>
              <td></td>
            </tr>
          </table>
        </div>
        <div className={styles.footer}>
          <div>
            Office Iraq 6650
            <br />
            info@alardhalsalba.command
            <br />
            Lebanese Village, F1 Gldg., 3rd.F, Erbil, Iraq
            <br />
            Website: alardhalsalba.com
          </div>
          <div>
            Exclusive Distributor in Iraq
            <img src={greeImage} alt="gree logo" className={styles.footerLogo} />
          </div>
          <div>
            مكتب العراق: 6650
            <br />
            العراق, أربيل, القرية اللبنانية, بناية F1, الطابق الثالث
          </div>
        </div>
      </div>
      <div className="column-double">
        <Button variant="contained" color="primary" onClick={() => print()}>
          <CloudDownload />
        </Button>
        <Button
          variant="contained"
          color="primary"
          href={`mailto:${info.email}?subject=Offer for you from Alardh-Alsalba&body=We create a special offer for you`}
        >
          <Send />
        </Button>
      </div>
    </>
  );
};

export default Receipt;
