export const getRoleName = (dbRoleName: string): string => {
  switch (dbRoleName) {
    case "CONTENT_MANAGER":
      return "CALL_CENTER";
    case "CONTENT_READER":
      return "SALES";
    case "LOGISTICS_MANAGER":
      return "TECHNITION";
    default:
      return dbRoleName;
  }
};
