import {
  type AppContext,
  generateJwtToken,
} from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    users: async (parent: any, args: any, app: AppContext) => {
      // check permissions


      // return result
      const result = await app.prismaClient.user.findMany({
        select: {
          id: true,
          user: true,
          isDisabled: true,
          role: true,
          centerId: true,
          level: true,
          center: {
            select: {
              name: true,
            },
          },
        },
        where: {
          AND: [
            {
              isDisabled:
                args.filter?.showDisabled === true ? undefined : false,
            },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            { OR: [{ user: filter.searchFilter(args.filter?.keyword) }] },
          ],
        },
      });

      return result;
    },
    usersCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions


      // return result
      const result = await app.prismaClient.user.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
      });

      return { count: result._count.id, date: result._max.createdAt };
    },
    user: async (parent: any, args: any, app: AppContext) => {
      // check permissions


      // return result
      const result = await app.prismaClient.user.findUnique({
        where: {
          id: args.id,
        },
        include: {
          offers: {
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
    userByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.user.findUnique({
        where: {
          user: app.user.name,
        },
        include: {
          offers: {
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
    verifyUser: async (parent: any, args: any, app: AppContext) => {
      let message = "";
      let success = false;

      // return result
      const userResult = await app.prismaClient.user.findUnique({
        where: {
          user: args.user,
        },
        select: {
          id: true,
          isDisabled: true,
        },
      });

      if (userResult == null || userResult.id == null)
        message = "User is not exists";
      else if (userResult.isDisabled === true) message = "User disabled";
      else {
        const result = await app.prismaClient.user.findFirst({
          where: {
            id: userResult.id,
            password: args.password,
          },
          select: {
            id: true,
            user: true,
            role: true,
            center: true,
          },
        });

        if (result != null) {
          await app.prismaClient.user.update({
            where: {
              id: userResult.id,
            },
            data: {
              lastLoginAt: new Date(),
            },
          });

          return {
            token: generateJwtToken({
              name: result.user,
              sub: result.user,
              roles: [result.roles],
              aud: result.center?.name ?? "[no-center]",
            }),
            message: "Login success",
            success: true,
          };
        } else message = "password error";
      }

      return { jwt: "", jwt2: "", message, success };
    },
  },
  Mutation: {
    createUser: async (parent: any, args: any, app: AppContext) => {
      // check permissions


      // return result
      const result = await app.prismaClient.user.create({
        data: {
          user: args.input.user,
          password: args.input.password,
          role: args.input.role,
          isDisabled: args.input.isDisabled,
          level: args.input.level,
          centerId: args.input.centerId,
        },
      });

      return result;
    },
    createTechnicalUser: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.user.create({
        data: {
          user: args.input.user,
          password: args.input.password,
          role: "LOGISTICS_MANAGER",
        },
      });

      return result;
    },
    updateUser: async (parent: any, args: any, app: AppContext) => {
      // check permissions


      // return result
      const result = await app.prismaClient.user.update({
        where: {
          id: args.id,
        },
        data: {
          user: args.input.user,
          password: args.input.password,
          role: args.input.role,
          isDisabled: args.input.isDisabled,
          level: args.input.level,
          centerId: args.input.centerId,
        },
      });

      return result;
    },
    updateUserByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.user.update({
        where: {
          id: app.user.id,
        },
        data: {
          user: args.input.user,
          password: args.input.password,
        },
      });

      return result;
    },
    deleteUser: async (parent: any, args: any, app: AppContext) => {
      // check permissions


      // return result
      const result = await app.prismaClient.user.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          user: true,
          isDisabled: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
