import { type AppContext, checkAuthorization, decodeUser, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    categories: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true
        },
      });

      return result;
    },
  },
  Mutation: {
    createCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.PRODUCT_MANAGER);

      // return result
      const result = await app.prismaClient.category.create({
        data: {
          name: args.input.name,
          image: args.input.image,
        }
      });

      return result;
    },
    updateCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.PRODUCT_MANAGER);

      // return result
      const result = await app.prismaClient.category.update({
        where: {
          id: args.id
        },
        data: {
          name: args.input.name,
          image: args.input.image
        }
      });

      return result;
    },
    deleteCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.PRODUCT_MANAGER);
  
      // return result
      const result = await app.prismaClient.category.delete({
        where: {
          id: args.id
        },
        select: {
          id: true,
          name: true
        }
      });

      return result;
    },
  },
};

export default resolvers;
