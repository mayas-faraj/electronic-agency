import React, { FunctionComponent } from "react";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import { CloudDownload, Send } from "@mui/icons-material";
import { reducer } from "../content-form";
import logoImage from "../../assets/imgs/logo-receipt.png";
import greeImage from "../../assets/imgs/gree-logo.jpg";
import getServerData from "../../libs/server-data";
import html2canvas from "html2canvas";
import styles from "../../styles/receipt.module.scss";

const initialInfo = {
  user: "",
  phone: "",
  email: "",
  firstName: "",
  lastName: "",
  offerDiscount: 0,
  isDiscountPercent: false,
  validationDays: 1,
  projectNumber: "",
  subject: "",
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
  const htmlRef = React.useRef<HTMLDivElement>(null);

  const totalPrice = products.reduce((acc, orderProduct) => acc + orderProduct.price * orderProduct.count, 0);
  const offerPrice = info.isDiscountPercent ? totalPrice * (1 - parseInt(info.offerDiscount as string) / 100) : totalPrice - parseInt(info.offerDiscount as string);
  console.log(info.isDiscountPercent, info.offerDiscount);
  const print = () => {
    if (htmlRef.current === null) return;

    html2canvas(htmlRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px"
      });
      pdf.addImage(imgData, "PNG", 20, 20, 400, 566);
      pdf.save("download.pdf");
    });
  };

  // on load
  React.useEffect(() => {
    const loadReceipt = async () => {
      const result = await getServerData(
        `query { order(id: ${id}) { id projectNumber subject address note company warranty delivery terms createdAt products { price count product { name nameTranslated model } } client { id user phone email firstName lastName } offer { id discount isDiscountPercent validationDays } } }`
      );

      if (result.data.order !== null) {
        dispatch({ type: "set", key: "phone", value: result.data.order.client.phone });
        dispatch({ type: "set", key: "email", value: result.data.order.client.email });
        dispatch({ type: "set", key: "firstName", value: result.data.order.client.firstName });
        dispatch({ type: "set", key: "lastName", value: result.data.order.client.lastName });
        dispatch({ type: "set", key: "user", value: result.data.order.user });
        dispatch({ type: "set", key: "createdAt", value: result.data.order.createdAt });
        dispatch({ type: "set", key: "projectNumber", value: result.data.order.projectNumber });
        dispatch({ type: "set", key: "subject", value: result.data.order.subject });
        dispatch({ type: "set", key: "address", value: result.data.order.address });
        dispatch({ type: "set", key: "note", value: result.data.order.note });
        dispatch({ type: "set", key: "company", value: result.data.order.company });
        dispatch({ type: "set", key: "delivery", value: result.data.order.delivery });
        dispatch({ type: "set", key: "warranty", value: result.data.order.warranty });
        dispatch({ type: "set", key: "terms", value: result.data.order.terms });
        dispatch({ type: "set", key: "offerDiscount", value: result.data.order.offer?.discount ?? 0 });
        dispatch({ type: "set", key: "isDiscountPercent", value: result.data.order.offer?.isDiscountPercent ?? false });
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
      <div className={`${styles.wrapper} ${isArabic ? styles.rtl : ""}`} ref={htmlRef}>
        <div className={styles.logoWrapper}>
          <img src={logoImage} alt="logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>{!isArabic ? "Price offer" : "عرض سعر"}</h1>
        <div className={styles.id}>
          {!isArabic ? "Offer" : "عرض"} #EST-IQD {id}
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
              <td>{!isArabic ? "Att:" : "حضرة السيد/ة:"}</td>
              <td>{`${info.firstName}${info.lastName && " "}${info.lastName}`}</td>
              <td>{!isArabic ? "Expiry Date:" : "تاريخ انتهاء الصلاحية:"}</td>
              <td>{new Date(parseInt(info.createdAt as string) + (info.validationDays as number) * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>{!isArabic ? "Mobile:" : "رقم الهاتف:"}</td>
              <td>{info.phone as string}</td>
              <td>{!isArabic ? "Reference #:" : "رقم المشروع:"}</td>
              <td>{info.projectNumber as string}</td>
            </tr>
          </tbody>
        </table>
        <p>
          {(info.subject as string) ??
            (!isArabic
              ? "We are glad to submit you with commerical price quotation for the products detailed below"
              : "يسرنا أن نقدم لكم عرض السعر التجاري للمنتجات المبينة تفاصيلها أدناه")}
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
            <tr className={styles.summaryRow}>
              <td colSpan={3}></td>
              <td>{!isArabic ? "Sub total" : "المجموع الفرعي"}:</td>
              <td></td>
              <td>
                {totalPrice.toLocaleString("en-US")} {!isArabic ? "IQD" : "د.ع."}
              </td>
            </tr>
            <tr className={styles.summaryRow}>
              <td colSpan={3}></td>
              <td>{!isArabic ? "Discount" : "الخصم"}:</td>
              <td></td>
              <td>
                {info.offerDiscount as string} {info.isDiscountPercent ? "%" : !isArabic ? "IQD" : "د.ع."}
              </td>
            </tr>
            <tr className={`${styles.strong} ${styles.summaryRow}`}>
              <td colSpan={3}></td>
              <td>{!isArabic ? "Total" : "الإجمالي"}:</td>
              <td></td>
              <td>
                {!isNaN(offerPrice) ? Math.ceil(offerPrice).toLocaleString("en-US") : 0} {!isArabic ? "IQD" : "د.ع."}
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.notes}>
          <table className={styles.notesTable}>
            <tbody>
              <tr>
                <td>{!isArabic ? "Notes" : "ملاحظات"}:</td>
                <td>{info.note as string}</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Payment terms" : "شروط الدفع"}:</td>
                <td>{info.terms as string}</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Delivery" : "التسليم"}:</td>
                <td>{info.delivery as string}</td>
              </tr>
              <tr>
                <td>{!isArabic ? "Warranty" : "الضمان"}:</td>
                <td>{info.warranty as string}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.footer}>
          <div>
            Office Iraq phone: 6650
            <br />
            email: info@alardhalsalba.com
            <br />
            Website: alardhalsalba.com
          </div>
          <div>
            Exclusive Distributor in Iraq
            <img src={greeImage} alt="gree logo" className={styles.footerLogo} />
          </div>
          <div>
            مكتب العراق هاتف رباعي: 6650
            <br />
            البريد الالكتروني: info@alardhalsalba.com
            <br />
            الموقع: alardhalsalba.com
          </div>
        </div>
      </div>
      <div className="column-double">
        <Button variant="contained" color="primary" onClick={() => print()}>
          <CloudDownload />
        </Button>
        <Button variant="contained" color="primary" href={`mailto:${info.email}?subject=Offer for you from Alardh-Alsalba&body=We create a special offer for you`}>
          <Send />
        </Button>
      </div>
    </>
  );
};

export default Receipt;
