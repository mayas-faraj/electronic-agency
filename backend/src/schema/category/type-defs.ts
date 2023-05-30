const typeDefs = `#graphql
	extend type Query {
        categories(filter: SearchFilter): [Category]
		category(id: Int!): Category
		subCategories(categoryId: Int!, filter: SearchFilter): [SubCategory]
		subCategory(id: Int!): SubCategory
		subCategoriesCount: AggregateResult
    }

    extend type Mutation {
        createCategory(input: CategoryInput!): Category
		updateCategory(id: Int!, input: CategoryUpdate!): Category
		deleteCategory(id: Int!): Category
		createSubCategory(input: SubCategoryInput!): SubCategory
		updateSubCategory(id: Int!, input: SubCategoryUpdate!): SubCategory
		deleteSubCategory(id: Int!): SubCategory
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

	type SubCategory {
		id: Int!
		categoryId: Int!
		name: String!
		image: String
		isDisabled: Boolean
		createdAt: String
		updatedAt: String
	}

	input SubCategoryInput {
		categoryId: Int!
		name: String!
		image: String
	}

	input SubCategoryUpdate {
		categoryId: Int
		name: String
		image: String
		isDisabled: Boolean
	}
`;

export default typeDefs;
