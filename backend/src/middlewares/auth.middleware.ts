import { MiddlewareFn } from "type-graphql";
import { GraphqlContext } from "../graphql/context";

export const isAuth: MiddlewareFn<GraphqlContext> = async (
  { context },
  next
) => {
  if (!context.user) throw new Error("User not logged");

  return next();
};
