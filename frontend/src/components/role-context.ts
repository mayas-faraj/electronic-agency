import React from "react";

interface Privileges {
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
  readOffer: boolean;
  writeOffer: boolean;
  readMaintenance: boolean;
  writeMaintenance: boolean;
  readOrder: boolean;
  writeOrder: boolean;
  readRepair: boolean;
  writeRepair: boolean;
}

const RoleContext = React.createContext<Privileges>({
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
  readOffer: false,
  writeOffer: false,
  readMaintenance: false,
  writeMaintenance: false,
  readOrder: false,
  writeOrder: false,
  readRepair: false,
  writeRepair: false,
});

export default RoleContext;
