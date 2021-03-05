import Socket from "~/utils/socket";
import createApis from "./index";

export default function createWsService(app, base) {
  const socket = new Socket(base, app.store);
  return createApis(socket);
}
