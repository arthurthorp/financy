import { Field, InputType } from "type-graphql";
import { IsEmail, MinLength, IsNotEmpty } from "class-validator";

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @Field(() => String)
  @IsEmail({}, { message: "Email is invalid" })
  email!: string;

  @Field(() => String)
  @MinLength(6, { message: "The password must have at least 6 caracthers" })
  password!: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail({}, { message: "Email is invalid" })
  email!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
