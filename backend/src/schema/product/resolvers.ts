import { type AppContext, checkAuthorization, decodeUser, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    products: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.findMany({
        select: {
          id: true,
          name: true,
          model: true,
          image: true,
          description: true,
          price: true,
          isDisabled: true
        },
        where: {
          AND: [
            { categoryId: args.categoryId},
            { isDisabled: args.filter?.onlyEnabled != null ? !args.filter.onlyEnabled : undefined, },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            { OR: [
              { name: filter.searchFilter(args.filter?.keyword) },
              { model: filter.searchFilter(args.filter?.keyword) },
              { description: filter.searchFilter(args.filter?.keyword) }
            ], }
          ], 
        },
      });

      return result;
    },
    productsCount: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.aggregate({
        _sum: {
          id: true
        },
        _max: {
          createdAt: true
        }
      });

      return { count: result._sum.id, date: result._max.createdAt };
    },
    product: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.product.findUnique({
        where: {
          id: args.id
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true
            }
          },
          items: {
            select: {
              sn: true,
              createdAt: true
            }
          }
        }
      });

      return result;
    },
    productItem: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItem.findUnique({
        where: {
          sn: args.sn
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              model: true,
              image: true,
              description: true,
              price: true,
              isDisabled: true
            }
          }
        },
      });

      return result;
    },
    productItemsByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItem.findMany({
        where: {
          client: {
            clientId: app.user.id
          }
        },
        select: {
          sn: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              model: true,
              image: true,
              description: true,
              price: true,
              isDisabled: true
            }
          }
        }
      });

      return result;
    },
  },
  Mutation: {
    createProduct: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);

      // return result
      const result = await app.prismaClient.product.create({
        data: {
         categoryId: args.input.categoryId,
         name: args.input.name,
         model: args.input.model,
         image: args.input.image,
         description: args.input.description,
         price: args.input.price,
        }
      });

      return result;
    },
    updateProduct: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);

      // return result
      const result = await app.prismaClient.product.update({
        where: {
          id: args.id
        },
        data: {
          categoryId: args.input.categoryId,
          name: args.input.name,
          model: args.input.model,
          image: args.input.image,
          description: args.input.description,
          price: args.input.price,
          isDisabled: args.input.isDisabled
        }
      });

      return result;
    },
    deleteProduct: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);
  
      // return result
      const result = await app.prismaClient.product.delete({
        where: {
          id: args.id
        },
        select: {
          id: true,
          name: true,
          model: true
        }
      });
  
      return result;
    },
    createProductItem: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);
  
      // return result
      const result = await app.prismaClient.productItem.create({
        data: {
          productId: args.productId,
          sn: args.sn
        },
        select: {
          sn: true,
          createdAt: true
        }
      });
  
      return result;
    },
    updateProductItem: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);
  
      // return result
      const result = await app.prismaClient.productItem.update({
        where: {
          sn: args.sn
        },
        data: {
          sn: args.newSn
        },
        select: {
          sn: true,
          createdAt: true
        }
      });
  
      return result;
    },
    deleteProductItem: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.PRODUCT_MANAGER);
  
      // return result
      const result = await app.prismaClient.productItem.delete({
        where: {
          sn: args.sn
        },
        select: {
          sn: true,
          createdAt: true
        }
      });
  
      return result;
    },
    createProductItemOnClientByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItemsOnClients.create({
        data: {
          clientId: app.user.id,
          productSn: args.sn
        },
        select: {
          clientId: true,
          productSn: true,
          createdAt: true
        }
      });
  
      return result;
    },
    deleteProductItemOnClientByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.productItemsOnClients.delete({
        where: {
          productSn: args.sn
        },
        select: {
          productSn: true,
          createdAt: true
        }
      });
  
      return result;
    },
    createProductReviewByAuth: async (parent: any, args: any, app: AppContext) => {
      // result result
      const result = await app.prismaClient.productReview.create({
        data: {
          clientId: app.user.id,
          productId: args.productId,
          rating: args.input.rating,
          comment: args.input.comment,
        },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true
        }
      });

      return result;
    },
    deleteProductReview: async (parent: any, args: any, app: AppContext) => {
      // result result
      const result = await app.prismaClient.productReview.delete({
        where: {
          id: args.id
        },
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true
        }
      });

      return result;
    },
  },
};

export default resolvers;
