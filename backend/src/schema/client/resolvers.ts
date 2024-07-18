import { GraphQLError } from "graphql";
import {
  type AppContext,
  checkAuthorization,
  generateJwtToken,
  generateServiceJwtToken,
  Role,
} from "../../auth.js";
import filter from "../filter.js";
import { generateName, generateVerificationCode } from "../generate.js";
import { sendSms } from "../../sms.js";

const resolvers = {
  Query: {
    clients: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(
        app.user.rol,
        Role.ADMIN,
        Role.SALES_MAN,
        Role.PRODUCT_MANAGER
      );

      // return result
      const result = await app.prismaClient.client.findMany({
        skip: args.pagination?.id != null ? 1 : undefined,
        take: args.pagination?.take,
        cursor:
          args.pagination?.id != null
            ? {
                id: args.pagination?.id,
              }
            : undefined,
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
          isDisabled: true,
        },
        where: {
          AND: [
            {
              isDisabled:
                args.filter?.showDisabled === true ? undefined : false,
            },
            { createdAt: filter.dateFilter(args.filter?.fromDate, false) },
            { createdAt: filter.dateFilter(args.filter?.toDate, true) },
            {
              OR: [
                { user: filter.searchFilter(args.filter?.keyword) },
                { phone: filter.searchFilter(args.filter?.keyword) },
                { firstName: filter.searchFilter(args.filter?.keyword) },
                { lastName: filter.searchFilter(args.filter?.keyword) },
              ],
            },
          ],
        },
        orderBy: {
          id: "desc",
        },
      });

      return result;
    },
    clientsCount: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(
        app.user.rol,
        Role.ADMIN,
        Role.SALES_MAN,
        Role.PRODUCT_MANAGER
      );

      // return result
      const result = await app.prismaClient.client.aggregate({
        _count: {
          id: true,
        },
        _max: {
          createdAt: true,
        },
      });

      return { count: result._count.id, date: result._max.createdAt };
    },
    client: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(
        app.user.rol,
        Role.ADMIN,
        Role.SALES_MAN,
        Role.PRODUCT_MANAGER
      );

      // return result
      const result = await app.prismaClient.client.findUnique({
        where: {
          id: args.id,
        },
        include: {
          orders: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    clientByPhone: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(
        app.user.rol,
        Role.ADMIN,
        Role.SALES_MAN,
        Role.PRODUCT_MANAGER,
        Role.TECHNICAL
      );

      // return result
      const result = await app.prismaClient.client.findUnique({
        where: {
          phone: args.phone,
        },
      });

      return result;
    },
    clientByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.client.findUnique({
        where: {
          id: app.user.id,
        },
        include: {
          orders: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
            },
          },
        },
      });

      return result;
    },
    verifyClient: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.client.findFirst({
        where: {
          id: args.clientId,
          isDisabled: false,
          code: {
            text: args.codeText,
          },
        },
        select: {
          id: true,
          user: true,
          firstName: true,
          lastName: true,
        },
      });

      if (result != null) {
        await app.prismaClient.client.update({
          where: {
            id: args.clientId,
          },
          data: {
            isVerified: true,
            lastLoginAt: new Date(),
          },
        });
        return {
          jwt: generateJwtToken({ id: result.id, nam: result.user, rol: "" }),
          jwt2: generateServiceJwtToken({
            name: result.user,
            sub: `${result.firstName} ${result.lastName}`,
            role: "SUBSCRIBER",
            aud: "ea",
          }),
          success: true,
        };
      } else return { jwt: "", success: false };
    },
  },
  Mutation: {
    createClient: async (parent: any, args: any, app: AppContext) => {
      // generate user
      let userName = generateName(
        args.input.email,
        args.input.firstName,
        args.input.lastName
      );

      const userResult = await app.prismaClient.client.findUnique({
        where: {
          user: userName,
        },
        select: {
          id: true,
        },
      });

      if (userResult?.id != null)
        userName += Math.ceil(Math.random() * 999 + 1).toString();
      // return result
      const result = await app.prismaClient.client.create({
        data: {
          user: userName.toLowerCase(),
          phone: args.input.phone,
          email: args.input.email,
          namePrefix: args.input.namePrefix,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
        },
      });

      return result;
    },
    updateClient: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.client.update({
        where: {
          id: args.id,
        },
        data: {
          user: args.input.user,
          phone: args.input.phone,
          email: args.input.email,
          avatar: args.input.avatar,
          namePrefix: args.input.namePrefix,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          birthDate: new Date(args.input.birthDate),
          isMale: args.input.isMale,
          isDisabled: args.input.isDisabled,
        },
      });

      return result;
    },
    updateClientByAuth: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.client.update({
        where: {
          id: app.user.id,
        },
        data: {
          user: args.input.user,
          phone: args.input.phone,
          email: args.input.email,
          avatar: args.input.avatar,
          namePrefix: args.input.namePrefix,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          birthDate: new Date(args.input.birthDate),
          isMale: args.input.isMale,
        },
      });

      return result;
    },
    deleteClient: async (parent: any, args: any, app: AppContext) => {
      // check permissions
      checkAuthorization(app.user.rol, Role.ADMIN, Role.SALES_MAN);

      // return result
      const result = await app.prismaClient.client.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          user: true,
          phone: true,
          email: true,
          namePrefix: true,
          firstName: true,
          lastName: true,
          isMale: true,
          isDisabled: true,
        },
      });

      return result;
    },
    upsertCode: async (parent: any, args: any, app: AppContext) => {
      // generate code text
      const codeText = generateVerificationCode();

      // save code
      const result = await app.prismaClient.code.upsert({
        where: {
          clientId: args.clientId,
        },
        create: {
          text: codeText,
          clientId: args.clientId,
        },
        update: {
          text: args.text,
        },
        select: {
          clientId: true,
          createdAt: true,
          client: {
            select: {
              phone: true,
            },
          },
        },
      });

      // send sms
      await sendSms(result.client.phone, codeText, (result) =>
        console.log("smsresult: ", result)
      );

      // return result
      return result;
    },
    upsertCodeByPhone: async (parent: any, args: any, app: AppContext) => {
      // generate code text
      const codeText = generateVerificationCode();

      // send sms
      await sendSms(args.phone, codeText, (result) =>
        console.log("smsresult: ", result)
      );
      // get client id
      const client = await app.prismaClient.client.findUnique({
        where: {
          phone: args.phone,
        },
        select: {
          id: true,
        },
      });

      if (client?.id == null)
        throw new GraphQLError("no user related with entered phone numer");

      // return result
      const result = await app.prismaClient.code.upsert({
        where: {
          clientId: client.id,
        },
        create: {
          text: codeText,
          clientId: client.id,
        },
        update: {
          text: codeText,
        },
        select: {
          clientId: true,
          createdAt: true,
        },
      });

      return result;
    },
  },
};

export default resolvers;
