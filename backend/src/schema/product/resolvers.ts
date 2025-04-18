import { type AppContext } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    products: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.findMany({
        skip: args.pagination?.id != null ? 1 : undefined,
        take: args.pagination?.take,
        cursor:
          args.pagination?.id != null
            ? {
                id: args.pagination.id,
              }
            : undefined,
        select: {
          id: true,
          name: true,
          nameTranslated: true,
          model: true,
          image: true,
          description: true,
          descriptionTranslated: true,
          specification: true,
          specificationTranslated: true,
          specificationImage: true,
          price: true,
          point: true,
          isDisabled: true,
          catalogFile: true,
          subCategory: {
            select: {
              id: true,
              categoryId: true,
              name: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
        where: {
          AND: [
            { subCategoryId: args.subCategoryId },
            {
              isDisabled:
                args.filter?.showDisabled === true ? undefined : false,
            },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            {
              OR: [
                { name: filter.searchFilter(args.filter?.keyword) },
                { nameTranslated: filter.searchFilter(args.filter?.keyword) },
                { model: filter.searchFilter(args.filter?.keyword) },
                { description: filter.searchFilter(args.filter?.keyword) },
                {
                  descriptionTranslated: filter.searchFilter(
                    args.filter?.keyword
                  ),
                },
                { specification: filter.searchFilter(args.filter?.keyword) },
                {
                  specificationTranslated: filter.searchFilter(
                    args.filter?.keyword
                  ),
                },
              ],
            },
          ],
        },
      });

      return result;
    },
    productsByIds: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.findMany({
        select: {
          id: true,
          name: true,
          nameTranslated: true,
          model: true,
          image: true,
          description: true,
          descriptionTranslated: true,
          specification: true,
          specificationTranslated: true,
          specificationImage: true,
          price: true,
          point: true,
          isDisabled: true,
          catalogFile: true,
          subCategory: {
            select: {
              id: true,
              categoryId: true,
              name: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
        where: {
          id: {
            in: args.idList
          }
        },
      });

      return result;
    },
    productsCount: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
      });

      return { count: result._count.id, date: result._max.createdAt };
    },
    product: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.findUnique({
        where: {
          id: args.id,
        },
        include: {
          subCategory: {
            select: {
              id: true,
              categoryId: true,
              name: true,
            },
          },
          items: {
            select: {
              sn: true,
              isSold: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    productItem: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItem.findUnique({
        where: {
          sn: args.sn,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              nameTranslated: true,
              model: true,
              image: true,
              description: true,
              descriptionTranslated: true,
              price: true,
              point: true,
              isDisabled: true,
            },
          },
          client: {
            select: {
              productSn: true,
              user: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    productItems: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItem.findMany({
        where: {
          sn: {
            in: args.snList,
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              nameTranslated: true,
              model: true,
              image: true,
              description: true,
              descriptionTranslated: true,
              price: true,
              point: true,
              isDisabled: true,
            },
          },
        },
      });

      return result;
    },
    productItemsByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItem.findMany({
        where: {
          client: {
            user: app.user.name
          },
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              nameTranslated: true,
              model: true,
              image: true,
              description: true,
              descriptionTranslated: true,
              specification: true,
              specificationTranslated: true,
              price: true,
              point: true,
              isDisabled: true,
            },
          },
        },
      });

      return result;
    },
  },
  Mutation: {
    createProduct: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // return result
      const result = await app.prismaClient.product.create({
        data: {
          subCategoryId: args.input.subCategoryId,
          name: args.input.name,
          nameTranslated: args.input.nameTranslated,
          model: args.input.model,
          image: args.input.image,
          description: args.input.description,
          descriptionTranslated: args.input.descriptionTranslated,
          specification: args.input.specification,
          specificationTranslated: args.input.specificationTranslated,
          specificationImage: args.input.specificationImage,
          catalogFile: args.input.catalogFile,
          price: args.input.price,
          point: args.input.point ?? 0
        },
      });

      return result;
    },
    updateProduct: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // return result
      const result = await app.prismaClient.product.update({
        where: {
          id: args.id,
        },
        data: {
          subCategoryId: args.input.subCategoryId,
          name: args.input.name,
          nameTranslated: args.input.nameTranslated,
          model: args.input.model,
          image: args.input.image,
          description: args.input.description,
          descriptionTranslated: args.input.descriptionTranslated,
          specification: args.input.specification,
          specificationTranslated: args.input.specificationTranslated,
          specificationImage: args.input.specificationImage,
          catalogFile: args.input.catalogFile,
          price: args.input.price,
          point: args.input.point,
          isDisabled: args.input.isDisabled,
        },
      });

      return result;
    },
    deleteProduct: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // return result
      const result = await app.prismaClient.product.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          name: true,
          nameTranslated: true,
          model: true,
        },
      });

      return result;
    },
    createProductItems: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // define result
      let acceptCount = 0;
      let errorCount = 0;
      let errorSnList: string[] = [];

      // return result
      for await (const sn of args.snList as string[]) {
        try {
          const result = await app.prismaClient.productItem.create({
            data: {
              productId: args.productId,
              sn,
            },
          });

          acceptCount++;
        } catch (ex) {
          errorCount++;
          errorSnList.push(sn);
        }
      }

      return {
        acceptCount,
        errorCount,
        errorSnList,
      };
    },
    updateProductItem: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // return result
      const result = await app.prismaClient.productItem.update({
        where: {
          sn: args.sn,
        },
        data: {
          sn: args.newSn,
        },
        select: {
          sn: true,
          createdAt: true,
        },
      });

      return result;
    },
    updateProductItemSold: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // return result
      const result = await app.prismaClient.productItem.update({
        where: {
          sn: args.sn,
        },
        data: {
          isSold: args.isSold,
        },
        select: {
          sn: true,
          createdAt: true,
        },
      });

      return result;
    },
    deleteProductItem: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      

      // return result
      const result = await app.prismaClient.productItem.delete({
        where: {
          sn: args.sn,
        },
        select: {
          sn: true,
          createdAt: true,
        },
      });

      return result;
    },
    createProductItemOnClientByAuth: async (
      parent: any,
      args: any,
      app: AppContext
    ) => {
      // return result
      const result = await app.prismaClient.productItemsOnClients.create({
        data: {
          user: app.user.name,
          productSn: args.sn,
        },
        select: {
          user: true,
          productSn: true,
          createdAt: true,
        },
      });

      return result;
    },
    deleteProductItemOnClientByAuth: async (
      parent: any,
      args: any,
      app: AppContext
    ) => {
      // return result
      const result = await app.prismaClient.productItemsOnClients.delete({
        where: {
          productSn: args.sn,
        },
        select: {
          productSn: true,
          createdAt: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
