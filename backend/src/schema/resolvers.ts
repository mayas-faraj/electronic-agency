import clientResolvers from "./client/resolvers.js";
import adminResolvers from "./admin/resolvers.js";
import categoryResolvers from "./category/resolvers.js";
import productResolvers from "./product/resolvers.js";
import orderResolvers from "./order/resolvers.js";
import maintenanceResolvers from "./maintenance/resolvers.js";
import advertisementResolvers from "./advertisment/resolver.js";
import centerResolvers from "./center/resolvers.js";

export default {
  Query: {
    ...adminResolvers.Query,
    ...clientResolvers.Query,
    ...categoryResolvers.Query,
    ...productResolvers.Query,
    ...orderResolvers.Query,
    ...maintenanceResolvers.Query,
    ...advertisementResolvers.Query,
    ...centerResolvers.Query
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...clientResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...productResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...maintenanceResolvers.Mutation,
    ...advertisementResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...centerResolvers.Mutation
  },
};
