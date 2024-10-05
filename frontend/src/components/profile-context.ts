import React from "react";

export interface Profile {
  id: number;
  name: string;
  userRoles?: {
    roleId: number;
    role: {
      name: string;
    };
  }[];
  centerId?: number;
  center?: {
    name: string;
  };
  privileges: Privileges;
}

export interface Privileges {
  createAdmin: boolean;
  readAdmin: boolean;
  updateAdmin: boolean;
  deleteAdmin: boolean;
  createClient: boolean;
  readClient: boolean;
  updateClient: boolean;
  deleteClient: boolean;
  createCategory: boolean;
  readCategory: boolean;
  updateCategory: boolean;
  deleteCategory: boolean;
  createProduct: boolean;
  readProduct: boolean;
  updateProduct: boolean;
  deleteProduct: boolean;
  createProductItem: boolean;
  readProductItem: boolean;
  updateProductItem: boolean;
  deleteProductItem: boolean;
  createAdvertisement: boolean;
  readAdvertisement: boolean;
  updateAdvertisement: boolean;
  deleteAdvertisement: boolean;
  createOrder: boolean;
  readOrder: boolean;
  updateOrder: boolean;
  deleteOrder: boolean;
  createOffer: boolean;
  readOffer: boolean;
  updateOffer: boolean;
  deleteOffer: boolean;
  createTicket: boolean;
  readTicket: boolean;
  updateTicket: boolean;
  deleteTicket: boolean;
  createRepair: boolean;
  updateRepair: boolean;
  createFeedback: boolean;
}

export const noPrivileges: Privileges = {
  createAdmin: false,
  readAdmin: false,
  updateAdmin: false,
  deleteAdmin: false,
  createClient: false,
  readClient: false,
  updateClient: false,
  deleteClient: false,
  createCategory: false,
  readCategory: false,
  updateCategory: false,
  deleteCategory: false,
  createProduct: false,
  readProduct: false,
  updateProduct: false,
  deleteProduct: false,
  createProductItem: false,
  readProductItem: false,
  updateProductItem: false,
  deleteProductItem: false,
  createAdvertisement: false,
  readAdvertisement: false,
  updateAdvertisement: false,
  deleteAdvertisement: false,
  createOrder: false,
  readOrder: false,
  updateOrder: false,
  deleteOrder: false,
  createOffer: false,
  readOffer: false,
  updateOffer: false,
  deleteOffer: false,
  createTicket: false,
  readTicket: false,
  updateTicket: false,
  deleteTicket: false,
  createRepair: false,
  updateRepair: false,
  createFeedback: false
};

type Role = "admin" | "data_viewer" | "sales_man" | "offer_admin" | "top_call_center" | "call_center" | "technician" | "closer" | "feedback";

export const getPrivileges = (roles: string[]): Privileges => {
  let privileges = noPrivileges;
  for (const role of roles) privileges = mergePrivileges(privileges, getPrivilegeOfRole(role as Role));
  return privileges;
};

const getPrivilegeOfRole = (role: Role): Privileges => {
  switch (role) {
    case "admin":
      return {
        createAdmin: true,
        readAdmin: true,
        updateAdmin: true,
        deleteAdmin: true,
        createClient: true,
        readClient: true,
        updateClient: true,
        deleteClient: true,
        createCategory: true,
        readCategory: true,
        updateCategory: true,
        deleteCategory: true,
        createProduct: true,
        readProduct: true,
        updateProduct: true,
        deleteProduct: true,
        createProductItem: true,
        readProductItem: true,
        updateProductItem: true,
        deleteProductItem: true,
        createAdvertisement: true,
        readAdvertisement: true,
        updateAdvertisement: true,
        deleteAdvertisement: true,
        createOrder: true,
        readOrder: true,
        updateOrder: true,
        deleteOrder: true,
        createOffer: true,
        readOffer: true,
        updateOffer: true,
        deleteOffer: true,
        createTicket: true,
        readTicket: true,
        updateTicket: true,
        deleteTicket: true,
        createRepair: true,
        updateRepair: true,
        createFeedback: true
      };
    case "data_viewer":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: false,
        readClient: true,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: true,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: true,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: true,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: true,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: false,
        readOrder: true,
        updateOrder: false,
        deleteOrder: false,
        createOffer: false,
        readOffer: true,
        updateOffer: false,
        deleteOffer: false,
        createTicket: false,
        readTicket: true,
        updateTicket: false,
        deleteTicket: false,
        createRepair: false,
        updateRepair: false,
        createFeedback: false
      };
    case "sales_man":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: true,
        readClient: true,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: true,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: true,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: true,
        readOrder: true,
        updateOrder: true,
        deleteOrder: true,
        createOffer: true,
        readOffer: true,
        updateOffer: true,
        deleteOffer: true,
        createTicket: false,
        readTicket: false,
        updateTicket: false,
        deleteTicket: false,
        createRepair: false,
        updateRepair: false,
        createFeedback: false
      };
    case "offer_admin":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: true,
        readClient: true,
        updateClient: true,
        deleteClient: true,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: true,
        readProduct: true,
        updateProduct: true,
        deleteProduct: true,
        createProductItem: true,
        readProductItem: true,
        updateProductItem: true,
        deleteProductItem: true,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: true,
        readOrder: true,
        updateOrder: true,
        deleteOrder: true,
        createOffer: true,
        readOffer: true,
        updateOffer: true,
        deleteOffer: true,
        createTicket: false,
        readTicket: false,
        updateTicket: false,
        deleteTicket: false,
        createRepair: false,
        updateRepair: false,
        createFeedback: false
      };
    case "top_call_center":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: true,
        readClient: true,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: true,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: false,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: false,
        readOrder: false,
        updateOrder: false,
        deleteOrder: false,
        createOffer: false,
        readOffer: false,
        updateOffer: false,
        deleteOffer: false,
        createTicket: true,
        readTicket: true,
        updateTicket: false,
        deleteTicket: false,
        createRepair: false,
        updateRepair: false,
        createFeedback: false
      };
    case "call_center":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: false,
        readClient: true,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: true,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: false,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: false,
        readOrder: false,
        updateOrder: false,
        deleteOrder: false,
        createOffer: false,
        readOffer: false,
        updateOffer: false,
        deleteOffer: false,
        createTicket: false,
        readTicket: true,
        updateTicket: true,
        deleteTicket: false,
        createRepair: false,
        updateRepair: false,
        createFeedback: false
      };
    case "technician":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: false,
        readClient: false,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: false,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: false,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: false,
        readOrder: false,
        updateOrder: false,
        deleteOrder: false,
        createOffer: false,
        readOffer: false,
        updateOffer: false,
        deleteOffer: false,
        createTicket: false,
        readTicket: true,
        updateTicket: false,
        deleteTicket: false,
        createRepair: true,
        updateRepair: false,
        createFeedback: false
      };
    case "closer":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: false,
        readClient: false,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: false,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: false,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: false,
        readOrder: false,
        updateOrder: false,
        deleteOrder: false,
        createOffer: false,
        readOffer: false,
        updateOffer: false,
        deleteOffer: false,
        createTicket: false,
        readTicket: true,
        updateTicket: false,
        deleteTicket: false,
        createRepair: false,
        updateRepair: true,
        createFeedback: false
      };
    case "feedback":
      return {
        createAdmin: false,
        readAdmin: false,
        updateAdmin: false,
        deleteAdmin: false,
        createClient: false,
        readClient: false,
        updateClient: false,
        deleteClient: false,
        createCategory: false,
        readCategory: false,
        updateCategory: false,
        deleteCategory: false,
        createProduct: false,
        readProduct: false,
        updateProduct: false,
        deleteProduct: false,
        createProductItem: false,
        readProductItem: false,
        updateProductItem: false,
        deleteProductItem: false,
        createAdvertisement: false,
        readAdvertisement: false,
        updateAdvertisement: false,
        deleteAdvertisement: false,
        createOrder: false,
        readOrder: false,
        updateOrder: false,
        deleteOrder: false,
        createOffer: false,
        readOffer: false,
        updateOffer: false,
        deleteOffer: false,
        createTicket: false,
        readTicket: true,
        updateTicket: false,
        deleteTicket: false,
        createRepair: false,
        updateRepair: false,
        createFeedback: true
      };
    default:
      return noPrivileges;
  }
};

const mergePrivileges = (privileges1: Privileges, privileges2: Privileges): Privileges => {
  const result = noPrivileges;
  for (const key in result) {
    const privilegeKey = key as keyof Privileges;
    result[privilegeKey] = privileges1[privilegeKey] || privileges2[privilegeKey];
  }

  return result;
};

export const noProfile: Profile = {
  id: 0,
  name: "",
  privileges: noPrivileges,
  userRoles: []
};

const ProfileContext = React.createContext<Profile>(noProfile);
ProfileContext.displayName = "profile context";
export default ProfileContext;
