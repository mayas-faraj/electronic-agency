const typeDefs = `#graphql
	extend type Query {
        admins(filter: SearchFilter): [AdminBasic]
		admin(id: Int!): Admin
		adminByAuth: Admin
    }

    extend type Mutation {
        createAdmin(input: AdminInput!): AdminBasic
		updateAdmin(id: Int!, input: AdminInput!): AdminBasic
		deleteAdmin(id: Int!): AdminBasic
    }

    type Admin {
		id: Int!
		user: String!
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		lastLoginAt: String
		role: String
		offers: [Offer]
		repairs: [Repair]
	}

	type AdminBasic {
		id: Int!
		user: String!
		isDisabled: Boolean
		role: String
	}

	input AdminInput {
		user: String!
		password: String
		isDisabled: Boolean
	}
`;

export default typeDefs;