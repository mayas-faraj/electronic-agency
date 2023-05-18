const typeDefs = `#graphql
	extend type Query {
        admins(filter: SearchFilter): [AdminBasic]
		adminsCount: AggregateResult
		admin(id: Int!): Admin
		adminByAuth: Admin
		verifyAdmin(user: String!, password: String!): User
    }

    extend type Mutation {
        createAdmin(input: AdminInput!): AdminBasic
		updateAdmin(id: Int!, input: AdminUpdate!): AdminBasic
		updateAdminByAuth(input: AdminUpdate!): AdminBasic
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

	input AdminInput {
		user: String
		password: String
		role: String
		isDisabled: Boolean
	}
`;

export default typeDefs;