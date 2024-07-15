const typeDefs = `#graphql
	extend type Query {
        clients(filter: SearchFilter, pagination: Pagination): [ClientBasic]
		clientsCount: AggregateResult
		client(id: Int!): Client
		clientByPhone(phone: String!): Client
		clientByAuth: Client
		verifyClient(clientId: Int!, codeText: String!): User
    }

    extend type Mutation {
	    createClient(input: ClientInput!): ClientBasic
		updateClient(id: Int!, input: ClientInput!): ClientBasic
		updateClientByAuth(input: ClientInput!): ClientBasic
		deleteClient(id: Int!): ClientBasic
		upsertCode(clientId: Int!): Code
		upsertCodeByPhone(phone: String!): Code
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
		isDisabled: Boolean
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
		clientId: Int
		createdAt: String
	}
`;

export default typeDefs;
