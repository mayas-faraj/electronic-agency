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
          isRead: true,
          isOfferRequest: true,
          createdAt: true,
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
              isDisabled: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc"
        },
        where: {
          AND: [
            { isDraft: false },
            {
              status:
                args.filter?.status != null ? args.filter.status : undefined,
            },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
          ],
        },
      });

      return result;
    },
    order: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

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
          isRead: true,
          isOfferRequest: true,
          createdAt: true,
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

      // set read value to true
      if (result != null)
        await app.prismaClient.order.update({
          where: {
            id: args.id,
          },
          data: {
            isRead: true,
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
          isOfferRequest: true,
          createdAt: true,
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
              isDisabled: true,
            },
          },
        },
      });

      return result;
    },
    ordersUnreadCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.order.aggregate({
        _count: {
          id: true,
        },
        where: {
          isRead: false,
          isDraft: false,
        },
      });

      return { count: result._count.id };
    },
    ordersCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.order.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
        _sum: {
          count: true,
        },
      });

      return {
        count: result._count.id,
        date: result._max.createdAt,
        sum: result._sum.count,
      };
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
          isOfferRequest: args.input.isOfferRequest,
        },
      });

      return result;
    },
    updateOrderStatus: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.update({
        where: {
          id: args.id
        },
        data: {
          status: args.status
        }
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
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

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
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

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
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

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
