import { Provider } from "./Provider";

export abstract class Dependant {
  abstract build?(provider: Provider): void;
}
