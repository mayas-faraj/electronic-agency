import clientTypeDefs from "./client/type-defs.js";
import adminTypeDefs from "./admin/type-defs.js";
import categoryTypeDefs from "./category/type-defs.js";
import productTypeDefs from "./product/type-defs.js";
import maintenanceTypeDefs from "./maintenance/type-defs.js";
import orderTypeDefs from "./order/type-defs.js";
import advertisementTypeDefs from "./advertisment/type-defs.js";
import centerTypeDefs from "./center/type-defs.js";

const typeDefs = `#graphql
	type Query {
		_empty: String
    }

    type Mutation {
		_empty: String
    }

	input Pagination {
		id: Int
		take: Int
	}

    input SearchFilter {
		showDisabled: Boolean
		keyword: String
		fromDate: String
		toDate: String
	}

	input StatusFilter {
		status: String
		fromDate: String
		toDate: String
	}

	type User {
		jwt: String!
		jwt2: String!
		success: Boolean!
		message: String!
	}

	type BatchResult {
		count: Int!
	}

	type AggregateResult {
		count: Int
		sum: Float
		date: String
	}
`;

export default [
  typeDefs,
  clientTypeDefs,
  adminTypeDefs,
  categoryTypeDefs,
  productTypeDefs,
  maintenanceTypeDefs,
  orderTypeDefs,
  advertisementTypeDefs,
  centerTypeDefs,
];
