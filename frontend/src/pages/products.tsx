import React from "react";
import Page from "../components/page";
import Products from "../components/content-tables/products";

const ProductsPage = () => {
  return (
    <Page title="Manage Products">
        <Products />
    </Page>
  )
};

export default ProductsPage;