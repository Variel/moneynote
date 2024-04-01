import { v4 as uuid } from "uuid";
import { Request } from "express";
import {
  Provider,
  Dependant,
  ServiceDescription,
} from "@backend-base/core/ServiceProvider";

export class HttpContext extends Dependant {
  static service: ServiceDescription<HttpContext> = {
    resolution: "scoped",
    instantiate: () => new HttpContext(),
  };

  build(provider: Provider): void {}

  request!: Request;
  requestId: string = uuid();
}
