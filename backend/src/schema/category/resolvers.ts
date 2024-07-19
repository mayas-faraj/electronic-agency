import { type AppContext, checkAuthorization, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    categories: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          nameTranslated: true,
          image: true,
          isDisabled: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          AND: [
            {
              isDisabled:
              args.filter?.showDisabled === true ? undefined : false
            },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            {
              OR: [
                { name: filter.searchFilter(args.filter?.keyword) },
                { nameTranslated: filter.searchFilter(args.filter?.keyword) },
              ],
            },
          ],
        },
      });

      return result;
    },
    category: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.category.findUnique({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          name: true,
          nameTranslated: true,
          image: true,
          isDisabled: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return result;
    },
    subCategories: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.subCategory.findMany({
        where: {
          AND: [
            { categoryId: args.categoryId },
            {
              isDisabled:
              args.filter?.showDisabled === true ? undefined : false
            },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            {
              OR: [
                { name: filter.searchFilter(args.filter?.keyword) },
                { nameTranslated: filter.searchFilter(args.filter?.keyword) },
              ],
            },
          ],
        },
        select: {
          id: true,
          categoryId: true,
          name: true,
          nameTranslated: true,
          image: true,
          isDisabled: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return result;
    },
    subCategory: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.subCategory.findUnique({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          categoryId: true,
          name: true,
          nameTranslated: true,
          image: true,
          isDisabled: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return result;
    },
    subCategoriesCount: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.subCategory.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
      });

      return { count: result._count.id, date: result._max.createdAt };
    },
  },
  Mutation: {
    createCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.CONTENT_MANAGER);

      // return result
      const result = await app.prismaClient.category.create({
        data: {
          name: args.input.name,
          nameTranslated: args.input.nameTranslated,
          image: args.input.image,
        },
      });

      return result;
    },
    updateCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.CONTENT_MANAGER);

      // return result
      const result = await app.prismaClient.category.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.input.name,
          nameTranslated: args.input.nameTranslated,
          image: args.input.image,
          isDisabled: args.input.isDisabled,
        },
      });

      return result;
    },
    deleteCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.CONTENT_MANAGER);

      // return result
      const result = await app.prismaClient.category.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return result;
    },
    createSubCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.CONTENT_MANAGER);

      // return result
      const result = await app.prismaClient.subCategory.create({
        data: {
          categoryId: args.input.categoryId,
          name: args.input.name,
          nameTranslated: args.input.nameTranslated,
          image: args.input.image,
        },
      });

      return result;
    },
    updateSubCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.CONTENT_MANAGER);

      // return result
      const result = await app.prismaClient.subCategory.update({
        where: {
          id: args.id,
        },
        data: {
          categoryId: args.input.categoryId,
          name: args.input.name,
          nameTranslated: args.input.nameTranslated,
          image: args.input.image,
          isDisabled: args.input.isDisabled,
        },
      });

      return result;
    },
    deleteSubCategory: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.CONTENT_MANAGER);

      // return result
      const result = await app.prismaClient.subCategory.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
