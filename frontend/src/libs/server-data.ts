import data from "../data.json";
import StorageManager from "./storage-manager";

const getServerData = async (gqlCommand: string) => {
  const token = StorageManager.get();
  const result = await fetch(data["backend-url"], {
    method: "post",
    mode: "cors",
    referrerPolicy: "unsafe-url",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: token != null ? "Bearer " + token : "",
    }),
    body: JSON.stringify({ query: gqlCommand }),
  });
  const jsonResult = await result.json();
  return jsonResult;
};

export default getServerData;
