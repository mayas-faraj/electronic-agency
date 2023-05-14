const typeDefs = `#graphql
	extend type Query {
        admins(filter: SearchFilter): [AdminBasic]
		adminsCount: BatchResult
		admin(id: Int!): Admin
		adminByAuth: Admin
		verifyAdmin(user: String!, password: String!): User
    }

    extend type Mutation {
        createAdmin(input: AdminInput!): AdminBasic
		updateAdmin(id: Int!, input: AdminInput!): AdminBasic
		updateAdminByAuth(input: AdminInput!): AdminBasic
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
		offers: [OfferBasic]
		repairs: [RepairBasic]
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
		role: String
		isDisabled: Boolean
	}
`;

export default typeDefs;