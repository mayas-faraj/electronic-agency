const typeDefs = `#graphql
	extend type Query {
        clients(filter: SearchFilter, pagination: Pagination): [ClientBasic]
		clientsCount: AggregateResult
		client(id: Int!): Client
		clientByUser(user: String!): Client
		clientByPhone(phone: String!): Client
		clientByAuth: Client
		verifyClient(clientId: Int!, codeText: String!): Login
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
		phone2: String
		address: String
		address2: String
		company: String
		email: String
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
		isDisabled: Boolean
		isTechnical: Boolean
		createdAt: String
		updatedAt: String
		lastLoginAt: String
		orders: [OrderBasic]
	}

	type ClientBasic {
		id: Int!
		user: String!
		phone: String!
		phone2: String
		address: String
		address2: String
		company: String
		email: String
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
		isDisabled: Boolean
		isTechnical: Boolean
	}

	input ClientInput {
		phone: String!
		phone2: String
		address: String
		address2: String
		company: String
		email: String!
		avatar: String
		namePrefix: String
		firstName: String
		lastName: String
		birthDate: String
		isMale: Boolean
		isDisabled: Boolean
		isTechnical: Boolean
	}

	type Code {
		clientId: Int
		createdAt: String
	}
`;

export default typeDefs;
