import { getArgument } from "@backend/utils/getArgument";

const DEFAULT_PORT_STRING = "3000";

export function configurePort() {
  const portArgv = getArgument("--port") ?? getArgument("-p");
  return parseInt(portArgv ?? process.env.PORT ?? DEFAULT_PORT_STRING);
}
