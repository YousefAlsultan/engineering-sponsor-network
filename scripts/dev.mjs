import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// Accept both the Sites preview CLI flags and Next's native development flags.
const provided = process.argv.slice(2);
let hostname = "127.0.0.1";
let port = "3000";

for (let index = 0; index < provided.length; index += 1) {
  const flag = provided[index];
  if (flag === "--host" || flag === "--hostname") {
    hostname = provided[index + 1] ?? hostname;
    index += 1;
  } else if (flag === "--port" || flag === "-p") {
    port = provided[index + 1] ?? port;
    index += 1;
  }
}

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [nextBin, "dev", "--hostname", hostname, "--port", port], {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});

process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
