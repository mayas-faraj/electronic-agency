import { type AppContext } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    orders: async (parent: any, args: any, app: AppContext) => {
      // check permissions

      // return result
      const result = await app.prismaClient.order.findMany({
        select: {
          id: true,
          status: true,
          isRead: true,
          isOfferRequest: true,
          createdAt: true,
          products: {
            select: {
              id: true,
              count: true,
              price: true,
              product: {
                select: {
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
          },
        },
        orderBy: {
          createdAt: "desc",
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

      // return result
      const result = await app.prismaClient.order.findUnique({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          user: true,
          projectNumber: true,
          subject: true,
          address: true,
          note: true,
          company: true,
          delivery: true,
          warranty: true,
          terms: true,
          status: true,
          isRead: true,
          isOfferRequest: true,
          createdAt: true,
          products: {
            select: {
              id: true,
              count: true,
              price: true,
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
          },
          offer: {
            select: {
              id: true,
              discount: true,
              isDiscountPercent: true,
              validationDays: true,
              createdAt: true,
            },
          },
        },
      });

      // set read value to true
      if (result != null) {
        await app.prismaClient.order.update({
          where: {
            id: args.id,
          },
          data: {
            isRead: true,
          },
        });

        const client = await app.prismaClient.client.findUnique({
          where: {
            user: result?.user,
          },
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
        });

        return { ...result, client };
      } else return null;
    },
    ordersByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.findMany({
        where: {
          user: app.user.name,
          isDraft: args.isDraft === true,
        },
        select: {
          id: true,
          status: true,
          isOfferRequest: true,
          createdAt: true,
          products: {
            select: {
              id: true,
              count: true,
              price: true,
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
          },
        },
      });

      console.dir(
        result.map((order) => ({
          id: order.id,
          status: order.status,
          isOfferRequest: order.isOfferRequest,
          createdAt: order.createdAt,
          count: order.products.reduce((pv, cv) => pv + cv.count, 0),
          totalPrice: order.products.reduce((pv, cv) => pv + cv.count, 0),
          product: order.products[0],
        })),
        { depth: null }
      );

      return result.map((order) => ({
        id: order.id,
        status: order.status,
        isOfferRequest: order.isOfferRequest,
        createdAt: order.createdAt,
        count: order.products.reduce((pv, cv) => pv + cv.count, 0),
        totalPrice: order.products.reduce((pv, cv) => pv + (cv.price ?? 0), 0),
        product: order.products[0].product,
      }));
    },
    ordersUnreadCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions

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

      // return result
      const result = await app.prismaClient.order.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
      });

      return {
        count: result._count.id,
        date: result._max.createdAt,
        sum: 0,
      };
    },
  },
  Mutation: {
    createOrderByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.create({
        data: {
          user: app.user.name,
          projectNumber: args.input.projectNumber,
          subject: args.input.subject,
          address: args.input.address,
          note: args.input.note,
          company: args.input.company,
          delivery: args.input.delivery,
          warranty: args.input.warranty,
          terms: args.input.terms,
          isDraft: args.input.isDraft,
          isOfferRequest: args.input.isOfferRequest,
          products: {
            create: {
              productId: args.input.productId,
              count: args.input.count,
              price: args.input.totalPrice,
            },
          },
        },
      });

      return result;
    },
    createOrder: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.create({
        data: {
          user: args.user,
          projectNumber: args.input.projectNumber,
          subject: args.input.subject,
          address: args.input.address,
          note: args.input.note,
          company: args.input.company,
          delivery: args.input.delivery,
          warranty: args.input.warranty,
          terms: args.input.terms,
          isDraft: false,
          isOfferRequest: true,
          status: "PENDING",
          products: {
            createMany: {
              data: args.input.products,
            },
          },
        },
      });

      return result;
    },
    updateOrderStatus: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.order.update({
        where: {
          id: args.id,
        },
        data: {
          status: args.status,
        },
      });

      return result;
    },
    deleteOrder: async (parent: any, args: any, app: AppContext) => {
      // check permissions

      // return result
      const result = await app.prismaClient.order.delete({
        where: {
          id: args.id,
        },
      });

      return result;
    },
    createOfferByAuth: async (parent: any, args: any, app: AppContext) => {
      // check permissions

      // return result
      const result = await app.prismaClient.offer.create({
        data: {
          orderId: args.input.orderId,
          discount: args.input.discount,
          isDiscountPercent: args.input.isDiscountPercent,
          validationDays: args.input.validationDays,
        },
        select: {
          id: true,
          discount: true,
          isDiscountPercent: true,
          validationDays: true,
          createdAt: true,
        },
      });

      return result;
    },
    updateOfferByAuth: async (parent: any, args: any, app: AppContext) => {
      // check permissions

      // return result
      const result = await app.prismaClient.offer.update({
        where: {
          id: args.id,
        },
        data: {
          discount: args.input.discount,
          isDiscountPercent: args.input.isDiscountPercent,
          validationDays: args.input.validationDays,
        },
        select: {
          id: true,
          discount: args.input.discount,
          isDiscountPercent: args.input.isDiscountPercent,
          validationDays: true,
          createdAt: true,
        },
      });

      return result;
    },
    deleteOffer: async (parent: any, args: any, app: AppContext) => {
      // check permissions

      // return result
      const result = await app.prismaClient.offer.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          discount: args.input.discount,
          isDiscountPercent: args.input.isDiscountPercent,
          validationDays: true,
          createdAt: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
