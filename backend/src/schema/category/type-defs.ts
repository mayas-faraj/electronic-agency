const typeDefs = `#graphql
	extend type Query {
        categories: [Category]
    }

    extend type Mutation {
        createCategory(input: CategoryInput!): Category
		updateCategory(id: Int!, input: CategoryInput!): Category
		deleteCategory(id: Int!): Category
    }

    type Category {
		id: Int!
		name: String!
		image: String
		createdAt: String
		updatedAt: String
	}

	input CategoryInput {
		name: String!
		image: String
	}
`;

export default typeDefs;