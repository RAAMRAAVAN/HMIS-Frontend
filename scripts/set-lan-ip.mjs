import fs from "fs";
import path from "path";

const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

const lanIp = (process.argv[2] || "").trim();

if (!lanIp) {
  console.error("❌ Missing LAN IP.");
  console.error("Usage: npm run lan:set -- <LAN_IP>");
  process.exit(1);
}

if (!ipv4Regex.test(lanIp)) {
  console.error(`❌ Invalid IPv4 address: ${lanIp}`);
  process.exit(1);
}

const envPath = path.join(process.cwd(), ".env.local");
let envContent = "";

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
}

const lines = envContent ? envContent.split(/\r?\n/) : [];

let hasLanIp = false;
let hasApiPort = false;

const nextLines = lines
  .filter((line) => !line.startsWith("NEXT_PUBLIC_CHAT_API_BASE_URL="))
  .map((line) => {
    if (line.startsWith("NEXT_PUBLIC_LAN_IP=")) {
      hasLanIp = true;
      return `NEXT_PUBLIC_LAN_IP=${lanIp}`;
    }

    if (line.startsWith("NEXT_PUBLIC_CHAT_API_PORT=")) {
      hasApiPort = true;
    }

    return line;
  });

if (!hasLanIp) {
  nextLines.push(`NEXT_PUBLIC_LAN_IP=${lanIp}`);
}

if (!hasApiPort) {
  nextLines.push("NEXT_PUBLIC_CHAT_API_PORT=5000");
}

const finalContent = `${nextLines.filter(Boolean).join("\n")}\n`;
fs.writeFileSync(envPath, finalContent, "utf8");

console.log(`✅ Updated NEXT_PUBLIC_LAN_IP=${lanIp} in ${envPath}`);
console.log("ℹ️ Restart Next.js and backend for changes to take effect.");