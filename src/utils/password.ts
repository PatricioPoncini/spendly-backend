import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, saltRounds);
};
