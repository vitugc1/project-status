import dotenv from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx --env-file=.env.local prisma/seed.ts",
  },
});
