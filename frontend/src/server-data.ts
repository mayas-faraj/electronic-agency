import data from "./data.json";

const getServerData = async (gqlCommand: string, isMutation: boolean) => {
  const token = localStorage.getItem("token");
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
