import { WebSocket, isWebSocketCloseEvent, uuidv4 } from "./deps.ts";
import { camelize } from "./camelize.ts";

const users = new Map<string, WebSocket>();

function broadcast(message: string, senderId?: string): void {
  if (!message) return;
  for (const user of users.values()) {
    user.send(senderId ? `[${senderId}]: ${message}` : message);
  }
}

export async function chat(ws: WebSocket): Promise<void> {
  const userId = uuidv4.generate();

  // register user connection
  users.set(userId, ws);
  broadcast(`> User with the id ${userId} is connected`);

  // Wait for new messages
  for await (const event of ws) {
    const message = camelize(typeof event === "string" ? event : "");

    broadcast(message, userId);

    if (!message && isWebSocketCloseEvent(event)) {
      users.delete(userId);
      broadcast(`> User with the id ${userId} is disconnected`);
      break;
    }
  }
}
