import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "@moneynote/backend-base";
import { SampleController } from "@backend/controllers/SampleController";

export function createRequestHandler() {
  const handler = new RequestHandler();

  handler.registerController({
    SampleController,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    await handler.handle(req, res);
  };
}
