import { type AppContext } from "../../auth.js";
import filter from "../filter.js";

const resolvers = {
  Query: {
    centers: async (_parent: any, args: any, app: AppContext) => {
      // return result
      return await app.prismaClient.center.findMany({
        where: { parentId: args.parentId },
        include: { users: true },
      });
    },
    center: async (_parent: any, args: any, app: AppContext) => {
      // find center
      return await app.prismaClient.center.findUnique({
        where: { id: args.id },
        include: {
          children: true,
          users: true,
        },
      });
    },
    centerByName: async (_parent: any, args: any, app: AppContext) => {
      // find center
      return await app.prismaClient.center.findUnique({
        where: { name: args.name },
        include: {
          children: true,
          users: {
            include: {
              userRoles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });
    },
    centersByParentName: async (_parent: any, args: any, app: AppContext) => {
      // find center
      return await app.prismaClient.center.findMany({
        where: {
          parent: {
            name: args.parentCenter,
          },
        },
        include: {
          children: true,
          users: true,
        },
      });
    },
  },
  Mutation: {
    createCenter: async (_parent: any, args: any, app: AppContext) => {
      // check authorization

      // return result
      return await app.prismaClient.center.create({
        data: {
          name: args.input.name,
          parentId: args.input.parentId,
        },
      });
    },
    updateCenter: async (_parent: any, args: any, app: AppContext) => {
      // check authorization

      // return result
      return await app.prismaClient.center.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.input.name,
          parentId: args.input.parentId,
        },
      });
    },
    deleteCenter: async (_parent: any, args: any, app: AppContext) => {
      // check authorization

      // return result
      return await app.prismaClient.center.delete({ where: { id: args.id } });
    },
  },
};

export default resolvers;
