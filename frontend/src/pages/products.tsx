import React from "react";
import Page from "../components/page";
import Products from "../components/contents/products";

const ProductsPage = () => {
  return (
    <Page title="Manage Products">
        <Products categoryId={1} />
    </Page>
  )
};

export default ProductsPage;