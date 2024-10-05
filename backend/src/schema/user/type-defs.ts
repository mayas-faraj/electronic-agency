const typeDefs = `#graphql
	extend type Query {
        users(filter: SearchFilter): [UserBasic]
		usersCount: AggregateResult
		user(id: Int!): User
		userByAuth: User
    }

    extend type Mutation {
		verifyUser(user: String!, password: String!): Login
        createUser(input: UserInput!): UserBasic
        createTechnicalUser(input: UserInput!): UserBasic
		updateUser(id: Int!, input: UserUpdate!): UserBasic
		updateUserByAuth(input: UserUpdate!): UserBasic
		deleteUser(id: Int!): UserBasic
    }

    type User {
		id: Int!
		user: String!
		level: Int!
		centerId: Int
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
		lastLoginAt: String
		userRoles: [UserRole]
		center: Center
	}

	type UserBasic {
		id: Int!
		user: String!
		isDisabled: Boolean
		userRoles: [UserRole]
		center: Center
	}

	type UserRole {
		roleId: Int!
		role: Role!
	}

	type Role {
		name: String!
	}

	input UserInput {
		user: String!
		password: String
		roles: [String]!
		isDisabled: Boolean
		level: Int
		centerId: Int
	}

	input UserUpdate {
		user: String
		password: String
		roles: [String]
		isDisabled: Boolean
		level: Int
		centerId: Int
	}
`;

export default typeDefs;
