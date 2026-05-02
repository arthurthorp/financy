import { MiddlewareFn } from "type-graphql";
import { GraphqlContext } from "../graphql/context";
import { GraphQLError } from "graphql";

export const isAuth: MiddlewareFn<GraphqlContext> = async (
  { context },
  next
) => {
  if (!context.user)
    throw new GraphQLError("User not logged", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });

  return next();
};
