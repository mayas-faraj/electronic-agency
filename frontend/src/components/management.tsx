import React, { FunctionComponent, ReactNode } from "react";
import { Alert, Button, Modal, Snackbar, Switch } from "@mui/material";
import { NameContext } from "./content";
import getServerData from "../libs/server-data";
import { DeleteForever, Edit, Save } from "@mui/icons-material";
import styles from "../styles/management.module.scss";

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
    operation: Operation
    command: string;
    commandDisabled?: boolean;
    commandDisabledMessage?: string;
    type?: ManagementType;
    hasConfirmModal?: boolean;
    initialValue?: any;
    onUpdate?: () => void;
    className?: string
}

// component
const Management: FunctionComponent<IManagementProps> = ({ command, commandDisabled, commandDisabledMessage, operation, type, hasConfirmModal, initialValue, className, onUpdate }) => {
    // component states
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [modalOpen, setModalOpen] = React.useState(false);

    // define types
    interface IButtonInfo {
        class: string
        text: string
        icon: ReactNode
    }

    // define variables
    let buttonInfo: IButtonInfo = {
        class: "",
        text: "",
        icon: null
    };

    switch (operation) {
        case Operation.create:
            buttonInfo = {
                class: styles["button--save"],
                text: "Create new",
                icon: <Save />
            }
            break;
        case Operation.update:
            buttonInfo = {
                class: styles["button--save"],
                text: "Update",
                icon: <Edit />
            }
            break;
        case Operation.delete:
            buttonInfo = {
                class: styles["button--delete"],
                text: "",
                icon: <DeleteForever />
            }
            break;
    }

    // get the name from content
    const name = React.useContext(NameContext);

    // event handler
    const action = async () => {
        if (commandDisabled !== true) {

            const result = await getServerData(command);
            if (result.errors != null) {
                if (result.errors.length > 0) setErrorMessage(result.errors[0].message);
                else setErrorMessage(`Error while ${Operation[operation]} ${name}`);
            } else {
                setSuccessMessage(`${Operation[operation]} ${name} has been completed successfully.`);
                setModalOpen(false);
                if (onUpdate != null) onUpdate();
            }
        } else setErrorMessage(commandDisabledMessage != null ? commandDisabledMessage : "Command is disabled");
    };

    const handleEvent = () => {
        if (hasConfirmModal) setModalOpen(true);
        else action();
    };

    // render component
    return (
        <>
            <div className={`${styles.wrapper} ${className}`}>
                {(type == null || type === ManagementType.button) && <Button variant="text" className={buttonInfo.class} onClick={() => handleEvent()}>{buttonInfo.icon} {buttonInfo.text}</Button>}
                {type === ManagementType.switch && <Switch className={styles.switch} onChange={() => action()} checked={initialValue === true} />}
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
                        <div className="modal">
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