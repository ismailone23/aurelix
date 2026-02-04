import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, type Context } from "@workspace/trpc";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  const authorization = req.headers.get("authorization");
  let userId: number | undefined;
  let userRole: string | undefined;

  if (authorization?.startsWith("Bearer ")) {
    try {
      const token = authorization.substring(7);
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT_SECRET is not defined");
        throw new Error("JWT_SECRET is not defined");
      }
      const decoded = jwt.verify(
        token,
        jwtSecret,
      ) as {
        userId: number;
        role: string;
      };
      userId = decoded.userId;
      userRole = decoded.role;
    } catch (err) {
      // Invalid token
      console.error("Token verification failed:", err);
    }
  }

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (): Context => ({
      userId,
      userRole,
    }),
  });
};

export { handler as GET, handler as POST };
