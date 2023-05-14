import React from "react";

export enum Role {
  ADMIN,
  PRODUCT_MANAGER,
  SALES_MAN,
  TECHNICAL,
}

export interface Privileges {
  readAdmin: boolean;
  writeAdmin: boolean;
  readClient: boolean;
  readCategory: boolean;
  writeCategory: boolean;
  readProduct: boolean;
  writeProduct: boolean;
  readProductItem: boolean;
  writeProductItem: boolean;
  readOrder: boolean;
  readOffer: boolean;
  writeOffer: boolean;
  readMaintenance: boolean;
  readRepair: boolean;
  writeRepair: boolean;
}

export const noPrivileges: Privileges = {
  readAdmin: false,
  writeAdmin: false,
  readClient: false,
  readCategory: false,
  writeCategory: false,
  readProduct: false,
  writeProduct: false,
  readProductItem: false,
  writeProductItem: false,
  readOrder: false,
  readOffer: false,
  writeOffer: false,
  readMaintenance: false,
  readRepair: false,
  writeRepair: false,
};

const RoleContext = React.createContext<Privileges>(noPrivileges);

export const getPrivileges = (role: string) => {
  switch (role) {
    case "ADMIN":
      return {
        readAdmin: true,
        writeAdmin: true,
        readClient: true,
        readCategory: true,
        writeCategory: false,
        readProduct: true,
        writeProduct: false,
        readProductItem: true,
        writeProductItem: false,
        readOrder: true,
        readOffer: true,
        writeOffer: false,
        readMaintenance: true,
        readRepair: true,
        writeRepair: false,
      };
    case "PRODUCT_MANAGER":
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: false,
        readCategory: true,
        writeCategory: true,
        readProduct: true,
        writeProduct: true,
        readProductItem: true,
        writeProductItem: true,
        readOrder: false,
        readOffer: false,
        writeOffer: false,
        readMaintenance: false,
        readRepair: false,
        writeRepair: false,
      };
    case "SALES_MAN":
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: true,
        readCategory: true,
        writeCategory: false,
        readProduct: true,
        writeProduct: false,
        readProductItem: true,
        writeProductItem: false,
        readOrder: true,
        readOffer: true,
        writeOffer: true,
        readMaintenance: false,
        readRepair: false,
        writeRepair: false,
      };
    case "TECHNICAL":
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: true,
        readCategory: false,
        writeCategory: false,
        readProduct: true,
        writeProduct: false,
        readProductItem: true,
        writeProductItem: false,
        readOrder: false,
        readOffer: false,
        writeOffer: false,
        readMaintenance: true,
        readRepair: true,
        writeRepair: true,
      };
    default:
      return noPrivileges;
  }
};

RoleContext.displayName = "role context";
export default RoleContext;
