import React from "react";
import { useParams } from "react-router-dom";
import Page from "../components/page";
import Center from "../components/content-tables/centers";
import getServerData from "../libs/server-data";

const CenterPage = () => {
  // get param
  const parentId = useParams()["parentId"];

  // title state
  const [centerName, setCenterName] = React.useState("");

  // on load
  React.useEffect(() => {
    const action = async () => {
      const result = await getServerData(`query { center(id: ${parentId}) { name }}`);
      setCenterName(result.data.center.name);
    };
    if (parentId !== undefined) action();
  }, [parentId]);

  return (
    <Page title="Centers">
      {centerName !== "" && <h2 className="center-text">of center: {centerName}</h2>}
      <Center parentId={parseInt(parentId ?? "0")} />
    </Page>
  );
};

export default CenterPage;
