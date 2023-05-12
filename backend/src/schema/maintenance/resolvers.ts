import { type AppContext, checkAuthorization, Role } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    maintenances: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.TECHNICAL);

      // return result
      const result = await app.prismaClient.maintenance.findMany({
        select: {
          id: true,
          description: true,
          propertyType: true,
          address: true,
          longitude: true,
          latitude: true,
          status: true,
          isRead: true,
          createdAt: true,
          bookedAt: true,
          productItem: {
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
    maintenance: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.TECHNICAL);

      // return result
      const result = await app.prismaClient.maintenance.findUnique({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          description: true,
          propertyType: true,
          address: true,
          longitude: true,
          latitude: true,
          status: true,
          isRead: true,
          createdAt: true,
          bookedAt: true,
          productItem: {
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
            },
          },
          repair: {
            select: {
              id: true,
              price: true,
              description: true,
              createdAt: true,
            },
          },
        },
      });

      // set read value to true
      if (result != null ) await app.prismaClient.maintenance.update({
        where: {
          id: args.id
        },
        data: {
          isRead: true
        }
      });

      return result;
    },
    maintenancesUnreadCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.TECHNICAL);

      // return result
      const result = await app.prismaClient.maintenance.aggregate({
        _count: {
          id: true
        },
        where: {
          isRead: false
        }
      });

      return { count: result._count };
    },
    maintenancesByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.maintenance.findMany({
        where: {
          isDraft: args.isDraft === true,
          productItem: {
            client: {
              clientId: app.user.id
            }
          }
        },
        select: {
          id: true,
          description: true,
          propertyType: true,
          address: true,
          longitude: true,
          latitude: true,
          status: true,
          createdAt: true,
          bookedAt: true,
          productItem: {
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
            },
          },
        },
      });

      return result;
    },
  },
  Mutation: {
    createMaintenance: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.maintenance.create({
        data: {
          productSn: args.input.productSn,
          description: args.input.description,
          propertyType: args.input.propertyType,
          address: args.input.address,
          longitude: args.input.longitude,
          latitude: args.input.latitude,
          createdAt: args.input.createdAt,
          bookedAt: new Date(args.input.bookedAt),
          status: args.input.status,
          isDraft: args.input.isDraft,
        },
        select: {
          id: true,
          description: true,
          propertyType: true,
          address: true,
          longitude: true,
          latitude: true,
          createdAt: true,
          bookedAt: true,
          status: true,
        }
      });

      return result;
    },
    deleteMaintenanceByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.maintenance.deleteMany({
        where: {
          id: args.id,
          productItem: {
            client: {
              clientId: app.user.id
            }
          }
        },
      });

      return result;
    },
    createRepairByAuth: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.TECHNICAL);

      // return result
      const result = await app.prismaClient.repair.create({
        data: {
          adminId: app.user.id,
          maintenanceId: args.input.maintenanceId,
          price: args.input.price,
          description: args.input.description
        },
        select: {
          id: true,
          price: true,
          description: true,
          createdAt: true,
        },
      });

      return result;
    },
    updateRepairByAuth: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.TECHNICAL);

      // return result
      const result = await app.prismaClient.repair.update({
        where: {
          id: args.id,
        },
        data: {
          adminId: app.user.id,
          price: args.input.price,
          description: args.input.description,
        },
        select: {
          id: true,
          price: true,
          description: true,
          createdAt: true,
        },
      });

      return result;
    },
    deleteRepair: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.TECHNICAL);

      // return result
      const result = await app.prismaClient.repair.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          price: true,
          description: true,
          createdAt: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
