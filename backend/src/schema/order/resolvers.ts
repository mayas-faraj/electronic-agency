import { type AppContext, checkAuthorization, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    orders: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.order.findMany({
        select: {
          id: true,
          count: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              model: true,
              image: true,
              description: true,
              price: true,
              isDisabled: true,
            },
          },
        },
        where: {
          AND: [
            { isDraft: false },
            { status: args.filter?.status != null ? args.filter.status : undefined,},
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
          ],
        },
      });

      return result;
    },
    order: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.findUnique({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          count: true,
          totalPrice: true,
          address: true,
          note: true,
          status: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              model: true,
              image: true,
              description: true,
              price: true,
              isDisabled: true,
            },
          },
          client: {
            select: {
              id: true,
              user: true,
              phone: true,
              email: true,
              avatar: true,
              namePrefix: true,
              firstName: true,
              lastName: true,
              birthDate: true,
              isMale: true,
            },
          },
          offer: {
            select: {
              id: true,
              price: true,
              validationDays: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    ordersByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.findMany({
        where: {
          clientId: app.user.id,
          isDraft: args.isDraft === true,
        },
        select: {
          id: true,
          count: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              model: true,
              image: true,
              description: true,
              price: true,
              isDisabled: true,
            },
          },
        },
      });

      return result;
    },
  },
  Mutation: {
    createOrderByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.create({
        data: {
          clientId: app.user.id,
          productId: args.input.productId,
          count: args.input.count,
          totalPrice: args.input.totalPrice,
          address: args.input.address,
          note: args.input.note,
          isDraft: args.input.isDraft,
        },
      });

      return result;
    },
    deleteOrderByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.deleteMany({
        where: {
          id: args.id,
        },
      });

      return result;
    },
    createOfferByAuth: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.offer.create({
        data: {
          adminId: app.user.id,
          orderId: args.input.orderId,
          price: args.input.price,
          validationDays: args.input.validationDays,
        },
        select: {
          id: true,
          price: true,
          validationDays: true,
          createdAt: true,
        },
      });

      return result;
    },
    updateOfferByAuth: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.offer.update({
        where: {
          id: args.id,
        },
        data: {
          adminId: app.user.id,
          price: args.input.price,
          validationDays: args.input.validationDays,
        },
        select: {
          id: true,
          price: true,
          validationDays: true,
          createdAt: true,
        },
      });

      return result;
    },
    deleteOffer: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.offer.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          price: true,
          validationDays: true,
          createdAt: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;