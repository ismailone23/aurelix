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
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as {
        userId: number;
        role: string;
      };
      userId = decoded.userId;
      userRole = decoded.role;
    } catch {
      // Invalid token
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
