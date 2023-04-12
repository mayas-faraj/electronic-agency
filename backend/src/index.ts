import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import typeDefs from './typedefs.js';
import resolvers from './resolvers.js';

// read configuration
dotenv.config()
const port = parseInt(process.env.PORT ?? '4000');

// create apollo server
const apolloServer = new ApolloServer({
	typeDefs,
	resolvers
});

// start server
const { url } = await startStandaloneServer(apolloServer, { listen: { port } });
console.log(`🚀  Server ready at: ${url}`);
