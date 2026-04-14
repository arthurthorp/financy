import bcrypt from "bcryptjs";

export const hashPassword = async (plainPassword: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

export const comparePassword = (
  plainPassoword: string,
  hashPassword: string,
) => {
  return bcrypt.compare(plainPassoword, hashPassword);
};
