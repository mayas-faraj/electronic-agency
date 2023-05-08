import clientTypeDefs from "./client/type-defs.js";
import adminTypeDefs from "./admin/type-defs.js";
import categoryTypeDefs from "./category/type-defs.js";
import productTypeDefs from "./product/type-defs.js";
import maintenanceTypeDefs from "./maintenance/type-defs.js";
import orderTypeDefs from "./order/type-defs.js";

const typeDefs = `#graphql
	type Query {
		_empty: String
    }

    type Mutation {
		_empty: String
    }

    input SearchFilter {
		onlyEnabled: Boolean
		keyword: String
		fromDate: String
		toDate: String
	}

	input StatusFilter {
		status: String
		fromDate: String
		toDate: String
	}

	type UserJwt {
		jwt: String!
	}
`;

export default [typeDefs, clientTypeDefs, adminTypeDefs, categoryTypeDefs, productTypeDefs, maintenanceTypeDefs, orderTypeDefs];