import React, { FunctionComponent } from "react";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import { CloudDownload, Send } from "@mui/icons-material";
import { reducer } from "../content-form";
import logoImage from "../../assets/imgs/logo-receipt.png";
import greeImage from "../../assets/imgs/gree-logo.jpg";
import getServerData from "../../libs/server-data";
import { font } from "../../libs/font";
import styles from "../../styles/receipt.module.scss";

const initialInfo = {
  user: "",
  phone: "",
  email: "",
  firstName: "",
  lastName: "",
  offerPrice: 0,
  validationDays: 1,
  address: "",
  note: ""
};

type OrderProduct = {
  product: {
    id: number;
    name: string;
    nameTranslated: string;
    model: string;
  };
  count: number;
  price: number;
};

interface IReceiptProps {
  id: number;
  isArabic?: boolean;
  onUpdate?: () => void;
}

const Receipt: FunctionComponent<IReceiptProps> = ({ id, isArabic, onUpdate }) => {
  // component reducer
  const [info, dispatch] = React.useReducer(reducer, initialInfo);
  const [products, setProducts] = React.useState<OrderProduct[]>([]);

  const totalPrice = products.reduce((acc, orderProduct) => acc + orderProduct.price * orderProduct.count, 0);

  const print = () => {
    const jsPdf = new jsPDF({
      orientation: "portrait",
      unit: "px"
    });
    jsPdf.html(document.getElementById("print") ?? "no data", {
      x: 20,
      y: 20,
      fontFaces: [{ family: "NotoNaskhArabic", src: [{ url: "/alardh-alsalba/noto-font.ttf", format: "truetype" }] }],
      width: 400,
      windowWidth: 650,
      callback: (doc) => {
        doc.addFileToVFS("NotoNaskhArabic.ttf", font);
        doc.addFont("NotoNaskhArabic.ttf", "NotoNaskhArabic", "normal");
        doc.addFont("NotoNaskhArabic.ttf", "NotoNaskhArabic", "bold");
        doc.setFont("NotoNaskhArabic");
        doc.save("receipt.pdf");
      }
    });
  };

  // on load
  React.useEffect(() => {
    const loadReceipt = async () => {
      const result = await getServerData(
        `query { order(id: ${id}) { id address note company warranty delivery terms createdAt products { price count product { name nameTranslated model } } client { id user phone email firstName lastName } offer { id price validationDays } } }`
      );

      if (result.data.order !== null) {
        dispatch({ type: "set", key: "phone", value: result.data.order.client.phone });
        dispatch({ type: "set", key: "email", value: result.data.order.client.email });
        dispatch({ type: "set", key: "firstName", value: result.data.order.client.firstName });
        dispatch({ type: "set", key: "lastName", value: result.data.order.client.lastName });
        dispatch({ type: "set", key: "user", value: result.data.order.user });
        dispatch({ type: "set", key: "createdAt", value: result.data.order.createdAt });
        dispatch({ type: "set", key: "address", value: result.data.order.address });
        dispatch({ type: "set", key: "note", value: result.data.order.note });
        dispatch({ type: "set", key: "company", value: result.data.order.company });
        dispatch({ type: "set", key: "delivery", value: result.data.order.delivery });
        dispatch({ type: "set", key: "warranty", value: result.data.order.warranty });
        dispatch({ type: "set", key: "terms", value: result.data.order.terms });
        dispatch({ type: "set", key: "offerPrice", value: result.data.order.offer?.price ?? 0 });
        dispatch({ type: "set", key: "validationDays", value: result.data.order.offer?.validationDays ?? 1 });

        setProducts(result.data.order.products);
      }

      if (onUpdate != null) onUpdate();
    };
    loadReceipt();
  }, [id, onUpdate]);

  // render component
  return (
    <>
      <div className={`${styles.wrapper} ${isArabic ? styles.rtl : ""}`} id="print">
        <div>
          <img src={logoImage} alt="logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>{!isArabic ? "Price offer" : "عرض سعر"}</h1>
        <div className={styles.id}>
          {!isArabic ? "Offer" : "عرض"} #EST-${id}
        </div>
        <table className={styles.schemaTable}>
          <tbody>
            <tr>
              <td>{!isArabic ? "Compay:" : "السادة:"}</td>
              <td>{info.company as string}</td>
              <td>{!isArabic ? "Offer Date:" : "تاريخ التقديم:"}</td>
              <td>{new Date(parseInt(info.createdAt as string)).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>{!isArabic ? "Att:" : "حضرة السيد:"}</td>
              <td>{`${info.firstName}${info.lastName && " "}${info.lastName}`}</td>
              <td>{!isArabic ? "Expiry Date:" : "تاريخ انتهاء الصلاحية:"}</td>
              <td>{new Date(parseInt(info.createdAt as string) + (info.validationDays as number) * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>{!isArabic ? "Mobile:" : "رقم الهاتف:"}</td>
              <td>{info.phone as string}</td>
              <td>{!isArabic ? "Reference #:" : "رقم المشروع:"}</td>
              <td>{id}</td>
            </tr>
          </tbody>
        </table>
        <p>
          {!isArabic
            ? "We are glad to submit you with commerical price quotation for the products detailed below"
            : "يسرنا أن نقدم لكم عرض السعر التجاري للمنتجات المبينة تفاصيلها أدناه"}
        </p>
        <table className={styles.productsTable}>
          <tbody>
            <tr>
              <th>{!isArabic ? "#" : "بند"}</th>
              <th>{!isArabic ? "Item" : "رمز الجهاز"}</th>
              <th>{!isArabic ? "Description" : "الوصف"}</th>
              <th>{!isArabic ? "QTY" : "الكمية"}</th>
              <th>{!isArabic ? "Unit Price" : "السعر"}</th>
              <th>{!isArabic ? "Amount" : "المبلغ"}</th>
            </tr>
            {products.map((orderProduct, index) => (
              <tr key={orderProduct.product.name + index.toString()}>
                <td>{index + 1}</td>
                <td>{orderProduct.product.model}</td>
                <td>{(!isArabic ? orderProduct.product.name : orderProduct.product.nameTranslated) as string}</td>
                <td>{orderProduct.count as number}</td>
                <td>{(orderProduct.price as number).toLocaleString("en-US")}</td>
                <td>{(orderProduct.price * orderProduct.count).toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.summary}>
          <table className={styles.summaryTable}>
            <tbody>
              <tr>
                <td>{!isArabic ? "Sub total:" : "المجموع الفرعي:"}</td>
                <td>{totalPrice.toLocaleString("en-US")} $</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Discount:" : "الخصم:"}:</td>
                <td>{info.offerPrice !== 0 ? (totalPrice - (info.offerPrice as number)).toLocaleString("en-US") : 0}</td>
              </tr>
              <tr className={styles.strong}>
                <td>{!isArabic ? "Total:" : "الإجمالي:"}</td>
                <td>{info.offerPrice !== 0 ? (info.offerPrice as number).toLocaleString("en-US") : totalPrice.toLocaleString("en-US")} $</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.notes}>
          <table className={styles.notesTable}>
            <tbody>
              <tr>
                <td>{!isArabic ? "Notes" : "ملاحظات:"}</td>
                <td>{info.note as string}</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Payment terms:" : "شروط الدفع:"}</td>
                <td>{info.terms as string}</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Delivery:" : "التسليم:"}</td>
                <td>{info.delivery as string}</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Warranty:" : "الضمان:"}</td>
                <td>{info.warranty as string}</td>
              </tr>
            </tbody>
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
