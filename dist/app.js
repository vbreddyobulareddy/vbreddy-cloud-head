"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const express_1 = __importDefault(require("express"));
const graphql_yoga_1 = require("graphql-yoga");
const helmet_1 = __importDefault(require("helmet"));
const app_data_source_1 = require("./app-data-source");
function buildApp(app) {
    const graphQLServer = (0, graphql_yoga_1.createYoga)({
        schema: (0, graphql_yoga_1.createSchema)({
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
    const router = express_1.default.Router();
    // Add specific CSP for GraphiQL by using an express router
    router.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                "style-src": ["'self'", "unpkg.com"],
                "script-src": ["'self'", "unpkg.com", "'unsafe-inline'"],
                "img-src": ["'self'", "raw.githubusercontent.com"],
            },
        },
    }));
    router.use(graphQLServer);
    // First register the router, to avoid Global CSP configuration to override the specific one
    app.use(graphQLServer.graphqlEndpoint, router);
    // Global CSP configuration
    app.use((0, helmet_1.default)());
    // Rest of the routes
    app.get("/", (req, res) => {
        const dataSource = (0, app_data_source_1.getAppDataSource)();
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
exports.buildApp = buildApp;
