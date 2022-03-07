let ws: WebSocket;
let lock = false;

const handlers: { [type: string]: ((message: any) => void)[] } = {};

function onMessage(msg: MessageEvent) {
  const message = JSON.parse(msg.data);
  console.log('received message', message);
  if (message.type in handlers) {
    for (const handler of handlers[message.type]) {
      handler(message);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWS(): Promise<WebSocket> {
  while (lock) await sleep(1);
  if (ws?.readyState === WebSocket.OPEN) return ws;
  lock = true;
  return new Promise((resolve) => {
    ws = new WebSocket('ws://localhost:8234');
    ws.onmessage = onMessage;
    ws.onopen = () => [(lock = false), resolve(ws)];
  });
}

export function sendMessage(type: string, message?: any) {
  console.log('sending message', type, message);
  getWS().then(() => ws.send(JSON.stringify({ type, ...message })));
}

export function listenWS(type: string, handler: (message: any) => void) {
  if (!(type in handlers)) handlers[type] = [];
  handlers[type].push(handler);
}
