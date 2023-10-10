import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { mongodb } from "@db/mongodb";
import userRoutes from "@user/user.routes";
import { badRequest } from "@libs/dto.lib";
import authRoutes from "@auth/auth.routes";

const app = new Hono();

mongodb.connect();

app.onError((err, c) => {
  console.log("[ERROR]", err.message);
  const { status, ...response } = badRequest("there is an error");
  return c.json(response, status);
});

app.use("*", logger());
app.use("*", secureHeaders());

app.route("/users", userRoutes);
app.route("/auth", authRoutes);

export default app;
