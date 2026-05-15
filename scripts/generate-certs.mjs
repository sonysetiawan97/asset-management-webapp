import selfsigned from "selfsigned";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certsDir = path.resolve(__dirname, "../certs");
const keyPath = path.join(certsDir, "dev.pem");
const certPath = path.join(certsDir, "cert.pem");

if (!existsSync(keyPath) || !existsSync(certPath)) {
  if (!existsSync(certsDir)) {
    mkdirSync(certsDir, { recursive: true });
  }

  const attrs = [{ name: "commonName", value: "localhost" }];
  const pems = selfsigned.generate(attrs, {
    algorithm: "sha256",
    days: 365,
    keySize: 2048,
    extensions: [{ name: "subjectAltName", altNames: [{ type: 2, value: "localhost" }, { type: 7, ip: "127.0.0.1" }] }],
  });

  writeFileSync(keyPath, pems.private);
  writeFileSync(certPath, pems.cert);
  console.log("SSL certificates generated in ./certs/");
}
