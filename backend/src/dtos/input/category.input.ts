import { Field, InputType } from "type-graphql";
import { IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsNotEmpty({ message: "Name is required" })
  title!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Icon is required" })
  icon!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Color is required" })
  color!: string;
}
