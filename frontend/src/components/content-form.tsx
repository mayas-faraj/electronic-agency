import React, { FunctionComponent, ReactNode } from "react";
import Management, { ManagementType, Operation } from "./management";
import Content from "./content";
import styles from "../styles/content-form.module.scss";

// type defintion
type primitiveType = number | string | boolean | Date;

export type FormData = {
  [key: string]: primitiveType;
};

export interface IAction {
  type: string;
  key: string;
  value: primitiveType;
}

// default function
const getDefaultValue = (value: primitiveType): primitiveType => {
  if (value instanceof Number) return 0;
  else if (value instanceof String) return "";
  else if (value instanceof Boolean) return false;
  else if (value instanceof Date) return Date.now();
  else return 0;
};

// define reducer
export const reducer = (state: FormData, action: IAction): FormData => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        [action.key]: action.value
      };
    case "reset":
      const result = { ...state };
      Object.keys(result).forEach((key) => {
        result[key] = getDefaultValue(result[key]);
      });
      return result;
    default:
      return {
        ...state
      };
  }
};

interface IContentForm {
  id?: number | string;
  name: string;
  title?: string;
  command: string;
  commandDisabled?: boolean;
  commandDisabledMessage?: string;
  onUpdate?: (result: any) => void;
  buttonIcon?: ReactNode;
  hasButtonText?: boolean;
  isService?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
}

// main component
const ContentForm: FunctionComponent<IContentForm> = ({
  id,
  name,
  title,
  command,
  commandDisabled,
  commandDisabledMessage,
  onUpdate,
  hasButtonText,
  buttonIcon,
  isService,
  isDisabled,
  children
}) => {
  return (
    <div className={styles.wrapper}>
      {title != null && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.form}>{children}</div>
      <Content name={name}>
        <Management
          type={ManagementType.button}
          operation={id === undefined ? Operation.create : Operation.update}
          hasConfirmModal={false}
          command={command}
          commandDisabled={commandDisabled}
          commandDisabledMessage={commandDisabledMessage ?? "Please fill all required fields"}
          onUpdate={onUpdate}
          buttonIcon={buttonIcon}
          hasButtonText={hasButtonText}
          isDisabled={isDisabled}
          isService={isService}
        />
      </Content>
    </div>
  );
};

export default ContentForm;
