import { Dependant } from "./Dependant";
import { ResolutionType, ServiceDescription } from "./ServiceDescription";

export class Provider {
  private static singletonInstances = new Map<string, Dependant>();
  private scopedInstances = new Map<string, Dependant>();

  private hasSingletonInRequirePath = false;

  require<T extends Dependant>(description: ServiceDescription<T>): T {
    if (this.hasSingletonInRequirePath && description.resolution === "scoped") {
      throw new Error(
        "resolution이 singleton인 경우 scoped 종속성을 가질 수 없습니다."
      );
    }

    let instance: Dependant;
    let buildNeeded = false;
    switch (description.resolution) {
      case "singleton":
        if (!description.key) {
          instance = this.register(description);
          buildNeeded = true;
        } else {
          instance = Provider.singletonInstances.get(description.key)!;
        }
        break;
      case "scoped":
        if (!description.key) {
          instance = this.register(description);
          buildNeeded = true;
        } else if (!this.scopedInstances.has(description.key)) {
          instance = this.register(description);
          buildNeeded = true;
        } else {
          instance = this.scopedInstances.get(description.key)!;
        }
        break;
      case "transient":
      default:
        instance = description.instantiate();
        buildNeeded = true;
        break;
    }

    if (buildNeeded) {
      const prevHasSingletonInRequirePath = this.hasSingletonInRequirePath;
      if (description.resolution === "singleton") {
        this.hasSingletonInRequirePath = true;
      }
      instance.build?.(this);
      this.hasSingletonInRequirePath = prevHasSingletonInRequirePath;
    }

    return instance as T;
  }

  private register<T extends Dependant>(description: ServiceDescription<T>) {
    if (description.key) {
      if (description.resolution === "singleton") {
        throw new Error("Already registered service");
      }
      const instance = description.instantiate();
      this.scopedInstances.set(description.key, instance);

      return instance;
    }

    description.key = crypto.randomUUID();
    Object.freeze(description);

    const instance = description.instantiate();

    if (description.resolution === "singleton") {
      Provider.singletonInstances.set(description.key, instance);
    } else if (description.resolution === "scoped") {
      this.scopedInstances.set(description.key, instance);
    }

    return instance;
  }
}
