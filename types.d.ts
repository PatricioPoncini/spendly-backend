export type AuthenticatedUser = {
  userId: string;
};

export type AuthEnv = {
  Variables: {
    user: AuthenticatedUser;
  };
};
