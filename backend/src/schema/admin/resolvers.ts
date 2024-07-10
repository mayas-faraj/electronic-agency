import {
  type AppContext,
  checkAuthorization,
  generateJwtToken,
  generateServiceJwtToken,
  Role,
} from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    admins: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.findMany({
        select: {
          id: true,
          user: true,
          isDisabled: true,
          role: true,
          centerId: true,
          level: true,
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
    adminsCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
      });

      return { count: result._count.id, date: result._max.createdAt };
    },
    admin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.findUnique({
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
          repairs: {
            select: {
              id: true,
              price: true,
              description: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    adminByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.admin.findUnique({
        where: {
          id: app.user.id,
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
          repairs: {
            select: {
              id: true,
              price: true,
              description: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    verifyAdmin: async (parent: any, args: any, app: AppContext) => {
      let message = "";
      let success = false;

      // return result
      const userResult = await app.prismaClient.admin.findUnique({
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
        const result = await app.prismaClient.admin.findFirst({
          where: {
            id: userResult.id,
            password: args.password,
          },
          select: {
            id: true,
            user: true,
            role: true,
          },
        });

        if (result != null) {
          await app.prismaClient.admin.update({
            where: {
              id: userResult.id,
            },
            data: {
              lastLoginAt: new Date(),
            },
          });

          return {
            jwt: generateJwtToken({
              id: result.id,
              nam: result.user,
              rol: result.role,
            }),
            jwt2: generateServiceJwtToken({
              name: result.user,
              sub: result.user,
              role: result.role,
              aud: "ea",
            }),
            message: "Login success",
            success: true,
          };
        } else message = "password error";
      }

      return { jwt: "", message, success };
    },
  },
  Mutation: {
    createAdmin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.create({
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
    updateAdmin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.update({
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
    updateAdminByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.admin.update({
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
    deleteAdmin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.delete({
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
