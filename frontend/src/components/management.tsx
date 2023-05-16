import React, { FunctionComponent } from "react";
import { Alert, Button, Modal, Snackbar, Switch } from "@mui/material";
import { NameContext } from "./content";
import getServerData from "../libs/server-data"; 
import styles from "../styles/management.module.scss";
import { DeleteForever, Edit } from "@mui/icons-material";

// type define
export enum ManagementType {
    button,
    switch
}

export enum Operation {
    create,
    update,
    delete
}

interface IManagementProps {
    command: string;
    operation: Operation
    type?: ManagementType;
    hasConfirmModal?: boolean;
    onUpdate?: () => void
}

// component
const Management: FunctionComponent<IManagementProps> = ({ command, operation, type, hasConfirmModal, onUpdate }) => {
    // component states
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [modalOpen, setModalOpen] = React.useState(false);

    // define variables
    let buttonClass = undefined;
    let buttonIcon = null;

    switch (operation) {
        case Operation.update:
            buttonClass = styles["button--update"];
            buttonIcon = <Edit />;
            break;
        case Operation.delete:
            buttonClass = styles["button--delete"];
            buttonIcon = <DeleteForever />;
            break;
    }

    // get the name from content
    const name = React.useContext(NameContext);

    // event handler
    const action = async () => {
        const result = await getServerData(command);
        if (result.errors != null) {
            if (result.errors.length > 0) setErrorMessage(result.errors[0].message);
            else setErrorMessage(`Error while ${Operation[operation]} ${name}`);
        } else {
            setSuccessMessage(`${Operation[operation]} ${name} has been completed successfully.`);
            setModalOpen(false);
            if (onUpdate != null) onUpdate();
        }
    };

    const handleEvent = () => {
        if (hasConfirmModal) setModalOpen(true);
        else action();
    };

    // render component
    return (
        <>
            <div className={styles.wrapper}>
                {(type == null || type === ManagementType.button) && <Button variant="text" className={buttonClass} onClick={() => handleEvent()}>{Operation[operation]} {buttonIcon}</Button>}
                {type === ManagementType.switch && <Switch className={styles.switch} onChange={() => action()} />}
            </div>
            <Snackbar open={successMessage !== ""} onClose={() => { setSuccessMessage("") }} autoHideDuration={6000}>
                <Alert severity="success">{successMessage}</Alert>
            </Snackbar>
            <Snackbar open={errorMessage !== ""} onClose={() => { setErrorMessage("") }} autoHideDuration={6000}>
                <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>
            {
                hasConfirmModal === true && (
                    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                        <div className={styles.modal}>
                            <strong className={styles.modal__title}>Confirm</strong>
                            <p className={styles.modal__text}>Are you sure to {Operation[operation]} {name}?</p>
                            <div className={styles.modal__buttons}>
                                <Button variant="contained" onClick={() => action()}>Yes</Button>
                                <Button variant="outlined" onClick={() => setModalOpen(false)}>No</Button>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
}

export default Management;