import { Request, Response } from "express";
import { notFound } from "@backend-base/helpers/response";
import { Result } from "@backend-base/models/result";
import { HttpContext } from "@backend-base/services/HttpContext";
import { Dependant, Provider, ServiceDescription } from "@backend-base/core/ServiceProvider";

const AVAILABLE_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
export type HttpMethod = (typeof AVAILABLE_METHODS)[number];

type ControllerType<T extends Dependant = Dependant> = {
  new (): Dependant;
  service: ServiceDescription<T>;
};

export class RequestHandler {
  controllerPathMap: Record<string, ControllerType> = {};

  handlerRequestMap: Record<string, Record<string, () => Promise<Result>>> = {};

  registerController(controllers: Record<string, ControllerType>) {
    Object.keys(controllers)
      .filter((controllerName) => controllerName.endsWith("Controller"))
      .forEach((controllerName) => {
        const pathName = controllerName.replace("Controller", "").toLowerCase();

        this.controllerPathMap[pathName] = controllers[controllerName];

        Object.getOwnPropertyNames(controllers[controllerName].prototype)
          .filter((name) => name !== "constructor")
          .forEach((handlerMethod) => {
            const match = /^(get|post|put|patch|delete)(.+)$/.exec(handlerMethod.toLowerCase());
            if (!match) return;

            if (!this.handlerRequestMap[pathName]) {
              this.handlerRequestMap[pathName] = {};
            }

            this.handlerRequestMap[pathName][`${match[1]}|${match[2]}`] =
              controllers[controllerName].prototype[handlerMethod];
          });
      });
  }

  async handle(request: Request, response: Response) {
    const resolved = this.resolveControllerAndMethod(request);
    if (!resolved) {
      this.respond(response, notFound());
      return;
    }

    const { controller, handlerMethod, controllerName, handlerMethodName } = resolved;

    const provider = new Provider();
    const httpContext = provider.require(HttpContext.service);
    httpContext.request = request;

    const controllerInstance = provider.require(controller.service);

    const result = await handlerMethod.apply(controllerInstance);

    this.respond(response, result);
  }

  private resolveControllerAndMethod(request: Request) {
    const url = toAbsoluteURL(request);

    const [controllerName, handlerMethodName] = url.pathname.toLowerCase().split("/").slice(1);
    const controller = this.controllerPathMap[controllerName];

    if (!controller) return null;

    const handlerMethod = this.getHandlerMethod(request.method as HttpMethod, handlerMethodName, controllerName);

    if (!handlerMethod) return null;

    return {
      controller,
      handlerMethod,
      controllerName,
      handlerMethodName,
    };
  }

  private getHandlerMethod(method: HttpMethod, handlerMethodName: string, controllerName: string) {
    const handlerMethod = this.handlerRequestMap[controllerName]?.[`${method.toLowerCase()}|${handlerMethodName}`];

    if (!handlerMethod) return null;
    return handlerMethod;
  }

  private respond(response: Response, result: Result) {
    switch (result.result) {
      case "success":
        response.status(result.httpStatus).json({
          success: true,
          data: result.data,
        });
        break;
      case "error":
        response.status(result.httpStatus).json({
          success: false,
          errorCode: result.errorCode,
          errorMessage: result.errorMessage,
        });
        break;
    }
  }
}

const toAbsoluteURL = (request: Request) => {
  const host = request.hostname;
  const protocol = request.protocol;
  return new URL(`${protocol}://${host}${request.originalUrl}`);
};
