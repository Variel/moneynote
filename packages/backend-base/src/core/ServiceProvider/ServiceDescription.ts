import { Dependant } from "./Dependant";

export type ResolutionType = "singleton" | "scoped" | "transient";

export type ServiceDescription<T extends Dependant = Dependant> = {
  resolution: ResolutionType;
  key?: string;
  instantiate: () => T;
};
