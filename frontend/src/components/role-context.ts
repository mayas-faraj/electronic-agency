import React from "react";

export interface Privileges {
  readAdmin: boolean;
  writeAdmin: boolean;
  readClient: boolean;
  writeClient: boolean;
  readCategory: boolean;
  writeCategory: boolean;
  readProduct: boolean;
  writeProduct: boolean;
  readProductItem: boolean;
  writeProductItem: boolean;
  readOrder: boolean;
  writeOrder: boolean;
  readOffer: boolean;
  writeOffer: boolean;
  readMaintenance: boolean;
  writeMaintenance: boolean;
  readRepair: boolean;
  writeRepair: boolean;
}

export const noPrivileges: Privileges = {
  readAdmin: false,
  writeAdmin: false,
  readClient: false,
  writeClient: false,
  readCategory: false,
  writeCategory: false,
  readProduct: false,
  writeProduct: false,
  readProductItem: false,
  writeProductItem: false,
  readOrder: false,
  writeOrder: false,
  readOffer: false,
  writeOffer: false,
  readMaintenance: false,
  writeMaintenance: false,
  readRepair: false,
  writeRepair: false,
};

export type Role = "ADMIN" | "PRODUCT_MANAGER" | "SALES_MAN" | "TECHNICAL";

export const getPrivileges = (role?: Role): Privileges => {
  switch (role) {
    case "ADMIN":
      return {
        readAdmin: true,
        writeAdmin: true,
        readClient: true,
        writeClient: true,
        readCategory: true,
        writeCategory: false,
        readProduct: true,
        writeProduct: false,
        readProductItem: true,
        writeProductItem: false,
        readOrder: true,
        writeOrder: false,
        readOffer: true,
        writeOffer: false,
        readMaintenance: true,
        writeMaintenance: false,
        readRepair: true,
        writeRepair: false,
      };
    case "PRODUCT_MANAGER":
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: false,
        writeClient: false,
        readCategory: true,
        writeCategory: true,
        readProduct: true,
        writeProduct: true,
        readProductItem: true,
        writeProductItem: true,
        readOrder: false,
        writeOrder: false,
        readOffer: false,
        writeOffer: false,
        readMaintenance: false,
        writeMaintenance: false,
        readRepair: false,
        writeRepair: false,
      };
    case "SALES_MAN":
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: true,
        writeClient: false,
        readCategory: true,
        writeCategory: false,
        readProduct: true,
        writeProduct: false,
        readProductItem: true,
        writeProductItem: false,
        readOrder: true,
        writeOrder: true,
        readOffer: true,
        writeOffer: true,
        readMaintenance: false,
        writeMaintenance: false,
        readRepair: false,
        writeRepair: false,
      };
    case "TECHNICAL":
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: false,
        writeClient: false,
        readCategory: false,
        writeCategory: false,
        readProduct: true,
        writeProduct: false,
        readProductItem: true,
        writeProductItem: false,
        readOrder: false,
        writeOrder: false,
        readOffer: false,
        writeOffer: false,
        readMaintenance: true,
        writeMaintenance: true,
        readRepair: true,
        writeRepair: true,
      };
    default:
      return noPrivileges;
  }
};

const RoleContext = React.createContext<Privileges>(noPrivileges);
RoleContext.displayName = "role context";
export default RoleContext;
