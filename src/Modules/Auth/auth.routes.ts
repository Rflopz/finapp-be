import { Hono } from "hono";
import { Jwt } from "hono/utils/jwt";

import { authError, badRequest, success } from "@libs/dto.lib";
import { isValidHash } from "./auth.actions";
import { IAuthentication } from "./auth.interfaces";

import { IUserModel } from "@user/user.model";
import {
  GetByEmailWithAuth,
  GetByIdWithAuth,
  GetJWT,
  create,
} from "@user/user.actions";

const authRoutes = new Hono();

authRoutes
  .post("/signup", async (c) => {
    const userValues = await c.req.json();

    if (!userValues)
      return c.json({ message: "There is not values to store" }, 400);

    const user = await create(userValues);

    const { status: errStatus, ...errResponse } = badRequest();
    if (!user) return c.json(errResponse, errStatus);

    const { status, ...response } = success(user, "Successfuly created");

    return c.json(response.data, status);
  })
  .post("/login", async (c) => {
    const { email, password } = await c.req.json();

    const user = await GetByEmailWithAuth(email);

    const { status: errorStatus, ...errorResponse } = authError();

    if (!user) return c.json(errorResponse, errorStatus);

    if (!isValidHash(user.authentication as IAuthentication, password))
      return c.json(errorResponse.data, errorStatus);

    const jwtoken = await GetJWT(user as IUserModel);

    const { status, ...response } = success(
      { token: jwtoken },
      "Successfuly login"
    );
    return c.json(response.data, status);
  })
  .post("/logout", async (c) => {
    const token = c.req.header("authorization")?.split(" ")[1];

    const { status: errStatus, ...errResponse } = authError("Invalid token");
    if (!token) return c.json(errResponse, errStatus);

    const { payload } = Jwt.decode(token);
    const user = await GetByIdWithAuth(payload.id);

    if (!user) return c.json(errResponse, errStatus);

    await GetJWT(user as IUserModel);

    const { status, ...response } = success({ message: "Successful logout" });
    return c.json(response.data, status);
  });

export default authRoutes;
