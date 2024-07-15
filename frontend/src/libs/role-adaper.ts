export const getRoleName = (dbRoleName: string): string => {
  switch (dbRoleName) {
    case "PRODUCT_MANAGER":
      return "CALL_CENTER";
    case "SALES_MAN":
      return "SALES";
    case "TECHNICAL":
      return "TECHNITION";
    default:
      return dbRoleName;
  }
};
