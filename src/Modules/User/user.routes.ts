import { Hono } from "hono";
import { success, notFound } from "@libs/dto.lib";
import { DeleteById, GetAllUsers, GetById, UpdateById } from "./user.actions";

const userRoutes = new Hono();

userRoutes
  .get("/", async (c) => {
    const all = await GetAllUsers();
    const { status, ...response } =
      all.length <= 0 ? notFound("Not users found") : success({ users: all });

    return c.json(response, status);
  })
  .get("/:id", async (c) => {
    const user = await GetById(c.req.param("id"));
    const { status, ...response } = !user
      ? notFound("User not found")
      : success({ user });

    return c.json(response, status);
  })
  .delete("/:id", async (c) => {
    const user = await DeleteById(c.req.param("id"));
    const { status, ...response } = !user
      ? notFound("Not user found")
      : success({ user });

    return c.json(response, status);
  })
  .put("/:id", async (c) => {
    const user = await UpdateById(c.req.param("id"), await c.req.json());
    const { status, ...response } = !user
      ? notFound("Not user found")
      : success({ user });

    return c.json(response, status);
  });

export default userRoutes;
