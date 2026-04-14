import { TransactionType } from "@prisma/client";
import { registerEnumType } from "type-graphql";

registerEnumType(TransactionType, {
  name: "TransactionType",
});
