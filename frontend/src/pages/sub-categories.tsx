import React from "react";
import { useParams } from "react-router-dom";
import Page from "../components/page";
import SubCategories from "../components/content-tables/sub-categories";
import getServerData from "../libs/server-data";

const SubCategoriesPage = () => {
  // get param
  const categoryId = useParams()["categoryid"];

  // title state
  const [categoryName, setCategoryName] = React.useState("");

  // on load
  React.useEffect(() => {
    const action = async () => {
      const result = await getServerData(`query { category(id: ${categoryId}) { name }}`);
      setCategoryName(result.data.category.name);
    };
    action();
  }, [categoryId]);

  return (
    <Page title="Sub-Categories">
      <h2 className="center-text">of category: {categoryName}</h2>
      {
        categoryId != null && <SubCategories categoryId={parseInt(categoryId)} />
      }
    </Page>
  )
};

export default SubCategoriesPage;