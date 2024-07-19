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
  readAdvertisement: boolean;
  writeAdvertisement: boolean;
  readOrder: boolean;
  writeOrder: boolean;
  readOffer: boolean;
  writeOffer: boolean;
  addTicket: boolean;
  readTicket: boolean;
  writeTicket: boolean;
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
  readAdvertisement: false,
  writeAdvertisement: false,
  readOrder: false,
  writeOrder: false,
  readOffer: false,
  writeOffer: false,
  addTicket: false,
  readTicket: false,
  writeTicket: false,
  readRepair: false,
  writeRepair: false
};

export type Role = "ADMIN" | "CONTENT_MANAGER" | "CONTENT_READER" | "LOGISTICS_MANAGER";

export const getPrivileges = (role?: Role, centerId?: number): Privileges => {
  const hasCenter = centerId != null && centerId !== 0;
  switch (JSON.stringify([role, hasCenter])) {
    case JSON.stringify(["ADMIN", false]):
      return {
        readAdmin: true,
        writeAdmin: true,
        readClient: true,
        writeClient: true,
        readCategory: true,
        writeCategory: true,
        readProduct: true,
        writeProduct: true,
        readProductItem: true,
        writeProductItem: true,
        readAdvertisement: true,
        writeAdvertisement: true,
        readOrder: true,
        writeOrder: true,
        readOffer: true,
        writeOffer: true,
        addTicket: true,
        readTicket: true,
        writeTicket: true,
        readRepair: true,
        writeRepair: true
      };
    case JSON.stringify(["CONTENT_MANAGER", false]):
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: true,
        writeClient: false,
        readCategory: true,
        writeCategory: true,
        readProduct: true,
        writeProduct: true,
        readProductItem: true,
        writeProductItem: true,
        readAdvertisement: false,
        writeAdvertisement: false,
        readOrder: false,
        writeOrder: false,
        readOffer: false,
        writeOffer: false,
        addTicket: true,
        readTicket: true,
        writeTicket: true,
        readRepair: false,
        writeRepair: false
      };
    case JSON.stringify(["CONTENT_MANAGER", true]):
      return {
        readAdmin: false,
        writeAdmin: false,
        readClient: true,
        writeClient: false,
        readCategory: true,
        writeCategory: true,
        readProduct: true,
        writeProduct: true,
        readProductItem: true,
        writeProductItem: true,
        readAdvertisement: false,
        writeAdvertisement: false,
        readOrder: false,
        writeOrder: false,
        readOffer: false,
        writeOffer: false,
        addTicket: false,
        readTicket: true,
        writeTicket: true,
        readRepair: false,
        writeRepair: false
      };
    case JSON.stringify(["CONTENT_READER", false]):
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
        readAdvertisement: true,
        writeAdvertisement: true,
        readOrder: true,
        writeOrder: true,
        readOffer: true,
        writeOffer: true,
        addTicket: false,
        readTicket: true,
        writeTicket: false,
        readRepair: false,
        writeRepair: false
      };
    case JSON.stringify(["LOGISTICS_MANAGER", true]):
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
        readAdvertisement: false,
        writeAdvertisement: false,
        readOrder: false,
        writeOrder: false,
        readOffer: false,
        writeOffer: false,
        addTicket: false,
        readTicket: true,
        writeTicket: true,
        readRepair: true,
        writeRepair: true
      };
    default:
      return noPrivileges;
  }
};

const RoleContext = React.createContext<Privileges>(noPrivileges);
RoleContext.displayName = "role context";
export default RoleContext;
