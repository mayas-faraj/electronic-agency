import React, { FunctionComponent } from "react";
import data from "./../data.json";
import styles from "../styles/image-upload.module.scss";
import { HourglassBottom } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";

// type defintion
interface IImageUploadProps {
    uploadUrl: string
    formName: string
    value: string
    onChange: (url: string) => void
}

const ImageUpload: FunctionComponent<IImageUploadProps> = ({ uploadUrl, formName, value, onChange }) => {
    const [imageSrc, setImageSrc] = React.useState<string>(value);
    const [isUpload, setIsUpload] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    // rerender by change value
    React.useEffect(() => {
        setImageSrc(value);
    }, [value])

    // handle file upload
    const handleUploadImage = (image: File) => {
        setIsUpload(true);
        const action = async () => {
            try {

                const formData = new FormData();
                formData.append(formName, image);
                const response = await fetch(data["site-url"] + uploadUrl, {
                    method: "POST",
                    body: formData
                }); 
                const result = await response.json();
                if (result.success) {
                    setImageSrc("/" + result.message);
                    onChange("/" + result.message)
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
            <img className="side-image side-image--product" src={data["site-url"] + (imageSrc)} alt="product" />
            <input id="file-upload" accept="image/*" type="file" hidden={true} onChange={(e) => handleUploadImage(e.target.files![0])} />
            <label htmlFor="file-upload" className="button button--large">Upload {isUpload && <HourglassBottom />}</label>
            <Snackbar open={errorMessage !== ""} onClose={() => { setErrorMessage("") }} autoHideDuration={6000}>
                <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>
        </div>
    )
}

export default ImageUpload;