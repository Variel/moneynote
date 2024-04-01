import express, { json, urlencoded } from "express";
import cors from "cors";
import { createRequestHandler } from "./createRequestHandler";

export function createApp() {
  const app = express();

  app.set("trust proxy", true);
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(corsAllowAll());

  app.use(createRequestHandler());

  return app;
}

function corsAllowAll() {
  return cors({
    origin: (_, callback) => callback(null, true),
    credentials: true,
  });
}
