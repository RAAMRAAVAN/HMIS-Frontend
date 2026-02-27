// /lib/sse.js
let clients = [];

export function addClient(writer) {
  clients.push(writer);
}

export function removeClient(writer) {
  clients = clients.filter((c) => c !== writer);
}

export function notifyOTUpdate(data) {
  console.log("🔥 notifyOTUpdate triggered with:", data);
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((c) => c.write(payload));
}
