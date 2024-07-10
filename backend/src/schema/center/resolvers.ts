import { type AppContext, checkAuthorization, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    centers: async (_parent: any, args: any, app: AppContext) => {
      // return result
      return await app.prismaClient.center.findMany({
        where: { parentId: args.parentId },
      });
    },
    center: async (_parent: any, args: any, app: AppContext) => {
      // find center
      return await app.prismaClient.center.findUnique({
        where: { id: args.id },
        include: {
          children: true,
        },
      });
    },
  },
  Mutation: {
    createCenter: async (_parent: any, args: any, app: AppContext) => {
      // check authorization
      checkAuthorization(app.user.rol, Role.ADMIN, Role.PRODUCT_MANAGER);

      // return result
      return await app.prismaClient.center.create({
        data: {
          name: args.input.name,
          parentId: args.input.parentId,
        },
      });
    },
    updateCenter: async (_parent: any, args: any, app: AppContext) => {
      // check authorization
      checkAuthorization(app.user.rol, Role.ADMIN, Role.PRODUCT_MANAGER);
      // return result
      return await app.prismaClient.center.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.input.name,
          parentId: args.input.parentId,
        },
      });
    },
    deleteCenter: async (_parent: any, args: any, app: AppContext) => {
      // check authorization
      checkAuthorization(app.user.rol, Role.ADMIN, Role.PRODUCT_MANAGER);
      // return result
      return await app.prismaClient.center.delete({ where: { id: args.id } });
    },
  },
};

export default resolvers;
