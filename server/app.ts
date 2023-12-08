import express from "express";
import { createSchema, createYoga } from "graphql-yoga";
import helmet from "helmet";
import { getAppDataSource } from "./app-data-source";

export function buildApp(app: ReturnType<typeof express>) {
  const graphQLServer = createYoga({
    schema: createSchema({
      typeDefs: /* GraphQL */ `
        type Query {
          hello: String
        }
      `,
      resolvers: {
        Query: {
          hello: () => "world",
        },
      },
    }),
    logging: false,
  });

  const router = express.Router();

  // Add specific CSP for GraphiQL by using an express router
  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "style-src": ["'self'", "unpkg.com"],
          "script-src": ["'self'", "unpkg.com", "'unsafe-inline'"],
          "img-src": ["'self'", "raw.githubusercontent.com"],
        },
      },
    })
  );

  router.use(graphQLServer);

  // First register the router, to avoid Global CSP configuration to override the specific one
  app.use(graphQLServer.graphqlEndpoint, router);

  // Global CSP configuration
  app.use(helmet());

  // Rest of the routes
  app.get("/", (req, res) => {
    const dataSource = getAppDataSource();
    dataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized");
        res.send("Data Source has been initialized");
      })
      .catch((err) => {
        console.log("Error during the dataSource initialization", err);
        res.send(err);
      });
  });

  return graphQLServer.graphqlEndpoint;
}
