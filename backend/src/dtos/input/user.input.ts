import { Field, InputType } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsNotEmpty({ message: "Name is required" })
  name!: string;
}
