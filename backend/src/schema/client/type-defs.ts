const typeDefs = `#graphql
	extend type Query {
        clients(filter: SearchFilter): [ClientBasic]
		client(id: Int!): Client
		clientByAuth: Client
		verifyClient(clientId: Int!, codeText: String!): UserJwt
    }

    extend type Mutation {
	    createClient(input: ClientInput!): ClientBasic
		updateClient(id: Int!, input: ClientInput!): ClientBasic
		updateClientByAuth(input: ClientInput!): ClientBasic
		deleteClient(id: Int!): ClientBasic
		upsertCode(clientId: Int!): Code
    }

    type Client {
		id: Int!
		user: String!
		phone: String
		email: String
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		lastLoginAt: String
		orders: [OrderBasic]
		reviews: [ProductReviewBasic]
	}

	type ClientBasic {
		id: Int!
		user: String!
		phone: String!
		email: String
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
	}

	input ClientInput {
		phone: String
		email: String
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
		isDisabled: Boolean
	}

	type Code {
		text: String
		createdAt: String
	}

	type UserJwt {
		jwt: String!
	}
`;

export default typeDefs;
