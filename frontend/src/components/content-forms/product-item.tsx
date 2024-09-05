import React, { FunctionComponent } from "react";
import { Alert, FormControl, Snackbar, TextField } from "@mui/material";
import ContentForm from "../content-form";
import getServerData from "../../libs/server-data";
import { AddCircle, CloudUpload } from "@mui/icons-material";

interface IProductProps {
  productId: number;
  productItemSn?: string;
  onUpdate?: () => void;
}

const ProductItem: FunctionComponent<IProductProps> = ({ productId, productItemSn, onUpdate }) => {
  // component reducer
  const [sn, setSn] = React.useState<string>("");
  const [importReport, setImportReport] = React.useState("");
  const [importError, setImportError] = React.useState(false);

  // handle upload text
  const handleUploadText = (textFile: File) => {
    const action = async () => {
      console.log(textFile.name);
      const buffer = await textFile.arrayBuffer();
      const textDecoder = new TextDecoder("utf-8");
      const content = textDecoder.decode(buffer);

      const snList = content.split(/\n|,|-/);
      const query = await getServerData(
        `mutation { createProductItems(productId: ${productId}, snList: [${snList
          .filter((sn) => sn.trim() !== "")
          .map((sn) => `"${sn}"`)
          .join(",")}])  {acceptCount errorCount errorSnList}}`
      );

      if (query.data?.createProductItems != null) {
        let report = "Import has completed\n";
        if (query.data.createProductItems.acceptCount === 0)
          report += `All SN are invalid: ${query.data.createProductItems.errorCount} (maybe already exists)\n`;
        else {
          report += `Success import count: ${query.data.createProductItems.acceptCount}\n`;
          if (query.data.createProductItems.errorCount !== 0) {
            report += `Error import count: ${query.data.createProductItems.errorCount}\n`;
            report += query.data.createProductItems.errorSnList.join("\n");
          }
        }

        setImportError(query.data?.createProductItems.errorCount !== 0);
        setImportReport(report);
      }
      if (onUpdate !== undefined) onUpdate();
    };
    action();
  };

  // event handler
  const handleUpdate = () => {
    setSn("");
    if (onUpdate != null) onUpdate();
  };

  // process form type (create or update)
  const productCommand =
    productItemSn == null || productItemSn === ""
      ? `mutation { createProductItems(productId: ${productId}, snList: ["${sn}"])  {acceptCount}}`
      : `mutation { updateProductItem(sn: "${productItemSn}", newSn: "${sn}")  {sn createdAt}}`;

  // render component
  return (
    <>
      <ContentForm
        id={productItemSn === "" ? undefined : productItemSn}
        name="product sn"
        title="Product SN"
        buttonIcon={<AddCircle />}
        hasButtonText={true}
        command={productCommand}
        commandDisabled={sn === ""}
        onUpdate={handleUpdate}
      >
        {productItemSn != null && productItemSn !== "" && (
          <FormControl fullWidth margin="normal">
            <TextField variant="outlined" label="Selected SN" value={productItemSn} aria-readonly={true} />
          </FormControl>
        )}
        <FormControl fullWidth margin="normal">
          <TextField variant="outlined" label="New SN" value={sn} onChange={(e) => setSn(e.target.value)} />
        </FormControl>
      </ContentForm>
      <div>
        <input id={"file-upload"} accept="text/plain, .csv" type="file" hidden={true} onChange={(e) => handleUploadText(e.target.files![0])} />
        <label htmlFor={"file-upload"} className="button button--large">
          <CloudUpload /> Import from file
        </label>
      </div>
      <Snackbar
        open={importReport !== ""}
        onClose={() => {
          setImportReport("");
        }}
      >
        <Alert severity={importError ? "error" : "success"}>
          {importReport
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => (
              <>
                <span>{line}</span>
                <br />
              </>
            ))}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductItem;
