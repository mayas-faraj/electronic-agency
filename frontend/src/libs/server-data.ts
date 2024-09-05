import data from "../data.json";
import StorageManager from "./storage-manager";

const getServerData = async (gqlCommand: string, isService?: boolean) => {
  let token = StorageManager.get();
  let backendUrl = data["backend-url"];

  if (isService) {
    backendUrl = data["backend-service-url"];
  }

  const result = await fetch(backendUrl, {
    method: "post",
    mode: "cors",
    referrerPolicy: "unsafe-url",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: token != null ? "Bearer " + token : ""
    }),
    body: JSON.stringify({ query: gqlCommand })
  });
  const jsonResult = await result.json();
  return jsonResult;
};

export default getServerData;
