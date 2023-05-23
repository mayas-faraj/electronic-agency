const typeDefs = `#graphql
	extend type Query {
        categories: [Category]
		categoriesCount: AggregateResult
		category(id: Int!): Category
    }

    extend type Mutation {
        createCategory(input: CategoryInput!): Category
		updateCategory(id: Int!, input: CategoryUpdate!): Category
		deleteCategory(id: Int!): Category
    }

    type Category {
		id: Int!
		name: String!
		image: String
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
	}

	input CategoryInput {
		name: String!
		image: String
	}

	input CategoryUpdate {
		name: String
		image: String
		isDisabled: Boolean
	}
`;

export default typeDefs;
