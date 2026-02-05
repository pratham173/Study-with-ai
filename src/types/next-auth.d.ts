import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the default JWT interface to include the user's database ID.
   * This allows us to associate JWT tokens with specific users in our database
   * for session management and user identification across requests.
   */
  interface JWT {
    id: string;
  }
}
