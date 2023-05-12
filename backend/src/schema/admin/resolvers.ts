import { type AppContext, checkAuthorization, decodeUser, Role } from "../../auth.js";
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
          role: true
        },
        where: {
          AND: [
            { isDisabled: args.filter?.onlyEnabled != null ? !args.filter.onlyEnabled : undefined, },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            { OR: [{ user: filter.searchFilter(args.filter?.keyword) }], }
          ], 
        },
      });

      return result;
    },
    admin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.findUnique({
        where: {
          id: args.id
        },
        include: {
          offers: {
            select: {
              id: true,
              price: true,
              validationDays: true,
              createdAt: true
            }
          },
          repairs: {
            select: {
              id: true,
              price: true,
              description: true,
              createdAt: true
            }
          },
        }
      });

      return result;
    },
    adminByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.admin.findUnique({
        where: {
          id: app.user.id
        },
        include: {
          offers: {
            select: {
              id: true,
              price: true,
              validationDays: true,
              createdAt: true
            }
          },
          repairs: {
            select: {
              id: true,
              price: true,
              description: true,
              createdAt: true
            }
          },
        }
      });

      return result;
    },
    verifyAdmin: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.admin.findFirst({
        where: {
          user: args.user,
          password: args.password
        },
        select: {
          id: true,
          user: true,
          role: true
        }
      });

      if (result != null)  return { 
          jwt: decodeUser({ id: result.id, nam: result.user, rol: result.role}),
          id: result.id,
          user: result.user
        };
      else return { jwt: ""};
    }
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
        }
      });

      return result;
    },
    updateAdmin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);

      // return result
      const result = await app.prismaClient.admin.update({
        where: {
          id: args.id
        },
        data: {
          user: args.input.user,
          password: args.input.password,
          role: args.input.role,
          isDisabled: args.input.isDisabled,
        }
      });

      return result;
    },
    updateAdminByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.admin.update({
        where: {
          id: app.user.id
        },
        data: {
          user: args.input.user,
          password: args.input.password,
        }
      });
  
      return result;
    },
    deleteAdmin: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN);
  
      // return result
      const result = await app.prismaClient.admin.delete({
        where: {
          id: args.id
        },
        select: {
          id: true,
          user: true,
          isDisabled: true,
        }
      });
  
      return result;
    },
  },
};

export default resolvers;
