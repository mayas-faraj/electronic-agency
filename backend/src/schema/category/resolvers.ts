import { type AppContext, checkAuthorization, decodeUser, Role } from "../../auth.js";

const resolvers = {
  Query: {
    categories: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          isDisabled: true,
          createdAt: true,
          updatedAt: true
        },
      });

      return result;
    },
    category: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.category.findUnique({
        where: {
          id: args.id
        },
        select: {
          id: true,
          name: true,
          image: true,
          isDisabled: true,
          createdAt: true,
          updatedAt: true
        },
      });

      return result;
    },
    categoriesCount: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.category.aggregate({
        _count: {
          id: true
        },
        _max: {
          createdAt: true
        }
      });

      return { count: result._count.id, date: result._max.createdAt };
    },
  },
  Mutation: {
    createCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);

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
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);

      // return result
      const result = await app.prismaClient.category.update({
        where: {
          id: args.id
        },
        data: {
          name: args.input.name,
          image: args.input.image,
          isDisabled: args.input.isDisabled
        }
      });

      return result;
    },
    deleteCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);
  
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
