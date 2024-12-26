import React, { FunctionComponent } from "react";
import data from "./../data.json";
import styles from "../styles/image-upload.module.scss";
import { HourglassBottom } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
import emptyImage from "../assets/imgs/empty.png";

// type defintion
interface IImageUploadProps {
  uploadUrl: string;
  formName: string;
  value: string;
  name?: string;
  onChange: (url: string) => void;
  token?: string;
}

const ImageUpload: FunctionComponent<IImageUploadProps> = ({ uploadUrl, formName, value, name, token, onChange }) => {
  const [imageSrc, setImageSrc] = React.useState<string>(value);
  const [isUpload, setIsUpload] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // rerender by change value
  React.useEffect(() => {
    setImageSrc(value);
  }, [value]);

  // handle file upload
  const handleUploadImage = (image: File) => {
    setIsUpload(true);
    const action = async () => {
      try {
        const formData = new FormData();
        formData.append(formName, image);
        const response = await fetch(data["media-service-url"] + uploadUrl, {
          method: "POST",
          body: formData,
          headers: token !== undefined ? { authorization: `BEARER ${token}` } : undefined
        });
        const result = await response.json();
        if (result.success) {
          setImageSrc(result.message);
          onChange(result.message);
        } else setErrorMessage(result.message);
      } catch (ex) {
        console.log(ex);
      }

      setIsUpload(false);
    };
    action();
  };

  return (
    <div className={styles.wrapper}>
      <img className="side-image side-image--product" src={imageSrc ? data["media-service-url"] + imageSrc : emptyImage} alt={`${formName} is empty`} />
      <input id={name ?? "file-upload"} accept="image/png, image/jpeg" type="file" hidden={true} onChange={(e) => handleUploadImage(e.target.files![0])} />
      <label htmlFor={name ?? "file-upload"} className="button button--large">
        Upload {isUpload && <HourglassBottom />}
      </label>
      <Snackbar
        open={errorMessage !== ""}
        onClose={() => {
          setErrorMessage("");
        }}
        autoHideDuration={6000}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default ImageUpload;
