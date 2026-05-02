import "dotenv/config";
import "reflect-metadata";
import "./graphql/enums";
import express from "express";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildContext } from "./graphql/context";
import { AuthResolver } from "./resolvers/auth.resolver";
import { CategoryResolver } from "./resolvers/category.resolver";
import { TransactionResolver } from "./resolvers/transaction.resolver";
import { DashboardResolver } from "./resolvers/dashboard.resolver";
import { UserResolver } from "./resolvers/user.resolver";

async function bootstrap() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      CategoryResolver,
      DashboardResolver,
      TransactionResolver,
      UserResolver,
    ],
    validate: true,
    emitSchemaFile: "./schema.gql",
  });

  const server = new ApolloServer({
    schema,
  });

  app.use(cors());

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    })
  );

  app.listen(4000, () => {
    console.log(`🚀 Server is running on http://localhost:4000/graphql`);
  });
}

bootstrap();
