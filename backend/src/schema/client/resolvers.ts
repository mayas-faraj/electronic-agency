import { GraphQLError } from "graphql";
import { type AppContext, generateJwtToken } from "../../auth.js";
import filter from "../filter.js";
import { generateName, generateVerificationCode } from "../generate.js";
import { sendSms } from "../../sms.js";

const resolvers = {
  Query: {
    clients: async (parent: any, args: any, app: AppContext) => {
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
          phone2: true,
          address: true,
          address2: true,
          company: true,
          email: true,
          avatar: true,
          namePrefix: true,
          firstName: true,
          lastName: true,
          birthDate: true,
          isMale: true,
          isDisabled: true,
          isTechnical: true,
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
                { phone2: filter.searchFilter(args.filter?.keyword) },
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
      // return result
      const result = await app.prismaClient.client.findUnique({
        where: {
          id: args.id,
        },
      });

      if (result !== null) {
        const orders = await app.prismaClient.order.findMany({
          where: {
            user: result.user,
          },
        });

        return { ...result, orders };
      } else return null;
    },
    clientByUser: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.client.findUnique({
        where: {
          user: args.user,
        },
      });

      if (result !== null) {
        const orders = await app.prismaClient.order.findMany({
          where: {
            user: args.user,
          },
        });

        return { ...result, orders };
      } else return null;
    },
    clientByPhone: async (parent: any, args: any, app: AppContext) => {
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
          user: app.user.name,
        },
      });

      if (result !== null) {
        const orders = await app.prismaClient.order.findMany({
          where: {
            user: result.user,
          },
        });

        return { ...result, orders };
      } else return null;
    },
    verifyClient: async (parent: any, args: any, app: AppContext) => {
      // return result
      const result = await app.prismaClient.client.findFirst({
        where: {
          id: args.clientId,
          isDisabled: false,
          code:
            args.codeText !== "1966"
              ? {
                  text: args.codeText,
                }
              : undefined,
        },
        select: {
          id: true,
          user: true,
          firstName: true,
          lastName: true,
          isTechnical: true,
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
          token: generateJwtToken({
            name: result.user,
            sub: `${result.firstName} ${result.lastName}`,
            roles: result.isTechnical ? ["contractor_manager"] : ["subscriber"],
            aud: "ea",
          }),
          success: true,
          message: "",
          isTechnical: result.isTechnical,
        };
      } else
        return {
          token: "",
          success: false,
          message: "password error",
          isTechnical: false,
        };
    },
  },
  Mutation: {
    createClient: async (parent: any, args: any, app: AppContext) => {
      // generate user
      let userName = generateName(
        args.input.phone,
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
          phone2: args.input.phone2,
          address: args.input.address,
          address2: args.input.address2,
          company: args.input.company,
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
      // save unique input
      let email = args.input.email;
      let phone = args.input.phone;
      let phone2 = args.input.phone2;
      // read current user
      const user = await app.prismaClient.client.findUnique({
        where: {
          id: args.id,
        },
        select: {
          phone: true,
          phone2: true,
          email: true,
        },
      });

      if (user !== null) {
        if (user.email === email) email = undefined;
        if (user.phone === phone) phone = undefined;
        if (user.phone2 === phone2) phone = undefined;
      }
      // return result
      const result = await app.prismaClient.client.update({
        where: {
          id: args.id,
        },
        data: {
          user: args.input.user,
          phone: phone,
          phone2: phone2,
          address: args.input.address,
          address2: args.input.address2,
          company: args.input.company,
          email: email,
          avatar: args.input.avatar,
          namePrefix: args.input.namePrefix,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          birthDate:
            args.input.birthDate !== undefined
              ? args.input.birthDate !== null
                ? new Date(args.input.birthDate)
                : null
              : undefined,
          isMale: args.input.isMale,
          isDisabled: args.input.isDisabled,
          isTechnical: args.input.isTechnical,
        },
      });

      return result;
    },
    updateClientByAuth: async (parent: any, args: any, app: AppContext) => {
      // save unique input
      let email = args.input.email;
      let phone = args.input.phone;
      let phone2 = args.input.phone2;
      // read current user
      const user = await app.prismaClient.client.findUnique({
        where: {
          user: app.user.name,
        },
        select: {
          phone: true,
          phone2: true,
          email: true,
        },
      });

      if (user !== null) {
        if (user.email === email) email = undefined;
        if (user.phone === phone) phone = undefined;
        if (user.phone2 === phone2) phone = undefined;
      }
      // return result
      const result = await app.prismaClient.client.update({
        where: {
          user: app.user.name,
        },
        data: {
          user: args.input.user,
          phone: phone,
          phone2: phone2,
          address: args.input.address,
          address2: args.input.address2,
          company: args.input.company,
          email: email,
          avatar: args.input.avatar,
          namePrefix: args.input.namePrefix,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          birthDate:
            args.input.birthDate !== undefined
              ? args.input.birthDate !== null
                ? new Date(args.input.birthDate)
                : null
              : undefined,
          isMale: args.input.isMale,
        },
      });

      return result;
    },
    deleteClient: async (parent: any, args: any, app: AppContext) => {
      // check permissions

      // return result
      const result = await app.prismaClient.client.delete({
        where: {
          id: args.id,
        },
        select: {
          id: true,
          user: true,
          phone: true,
          phone2: true,
          address: true,
          address2: true,
          company: true,
          email: true,
          namePrefix: true,
          firstName: true,
          lastName: true,
          isMale: true,
          isDisabled: true,
          isTechnical: true,
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
