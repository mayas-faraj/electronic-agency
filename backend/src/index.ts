import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { type UserContext, decodeUser, getUserFromJwt } from './auth.js';
import typeDefs from './typedefs.js';
import resolvers from './resolvers.js';

// read configuration
dotenv.config();
const port = parseInt(process.env.PORT ?? '4000');
const isDevelopment = process.env.ENV === 'development';

// create apollo server
const apolloServer = new ApolloServer<UserContext>({
	typeDefs,
	resolvers,
	introspection: isDevelopment,
});

// start ,
const { url } = await startStandaloneServer(apolloServer, {
	 listen: { port },
	 context: async ({ req }) => {
		let jwtToken = req.headers.authorization || '';
		if (jwtToken.indexOf(' ') > 0) jwtToken = jwtToken.split(' ')[1];
		return getUserFromJwt(jwtToken);
	 }
});
console.log(`🚀  Server ready at: ${url}`);
