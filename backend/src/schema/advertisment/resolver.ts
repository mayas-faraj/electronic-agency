import { type AppContext, checkAuthorization, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    advertisements: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.advertisement.findMany({
        select: {
          id: true,
          imageUrl: true,
          imageOrder: true,
          createdAt: true,
        },
        orderBy: {
          imageOrder: "asc",
        },
      });

      return result;
    },
    advertisement: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.advertisement.findUnique({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          imageUrl: true,
          imageOrder: true,
          createdAt: true,
        },
      });

      return result;
    },
  },
  Mutation: {
    createAdvertisement: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.advertisement.create({
        data: {
          imageUrl: args.input.imageUrl,
          imageOrder: args.input.imageOrder,
        },
      });

      return result;
    },
    updateAdvertisement: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.advertisement.update({
        where: {
          id: args.id,
        },
        data: {
          imageUrl: args.input.imageUrl,
          imageOrder: args.input.imageOrder,
        },
      });

      return result;
    },
    deleteAdvertisement: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.advertisement.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          imageUrl: true,
          imageOrder: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
