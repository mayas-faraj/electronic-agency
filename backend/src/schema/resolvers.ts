import clientResolvers from "./client/resolvers.js";
import userResolvers from "./user/resolvers.js";
import categoryResolvers from "./category/resolvers.js";
import productResolvers from "./product/resolvers.js";
import orderResolvers from "./order/resolvers.js";
import advertisementResolvers from "./advertisment/resolver.js";
import centerResolvers from "./center/resolvers.js";

export default {
  Query: {
    ...userResolvers.Query,
    ...clientResolvers.Query,
    ...categoryResolvers.Query,
    ...productResolvers.Query,
    ...orderResolvers.Query,
    ...advertisementResolvers.Query,
    ...centerResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...productResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...advertisementResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...centerResolvers.Mutation
  },
};
