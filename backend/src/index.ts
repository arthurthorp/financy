import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildContext } from "./graphql/context";
import { AuthResolver } from "./resolvers/auth.resolver";
import { CategoryResolver } from "./resolvers/category.resolver";

async function bootstrap() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, CategoryResolver],
    validate: true,
    emitSchemaFile: "./schema.gql",
  });

  const server = new ApolloServer({
    schema,
  });

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
