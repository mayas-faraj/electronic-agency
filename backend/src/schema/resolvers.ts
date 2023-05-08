import clientResolvers from "./client/resolvers.js";
import adminResolvers from "./admin/resolvers.js";

export default {
  Query: {
    ...adminResolvers.Query,
    ...clientResolvers.Query,
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...clientResolvers.Mutation,
  },
};
