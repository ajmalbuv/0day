import { defineConfig } from "vite";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatePersonSchema } from "./src/schema/person";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_PATH = process.env.VITE_BASE || "/";
const SITE_URL =
  process.env.VITE_SITE_URL || "https://ajmalbuv.github.io/0day/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    (() => {
      let avatarPath = "";
      return {
        name: "jsonld-csp-automation",
        generateBundle(bundle) {
          for (const [fileName] of Object.entries(bundle)) {
            if (fileName.includes("avatar") && fileName.endsWith(".webp")) {
              avatarPath = (BASE_PATH + fileName).replace(/\/+/g, "/");
              break;
            }
          }
        },
        closeBundle() {
          const distDir = path.resolve(__dirname, "dist");
          const htmlPath = path.join(distDir, "index.html");
          if (!avatarPath)
            avatarPath = (BASE_PATH + "assets/avatar.webp").replace(
              /\/+/g,
              "/",
            );
          const schemaObj = generatePersonSchema(avatarPath, SITE_URL);
          const schemaJson = JSON.stringify(schemaObj);
          const scriptTag = `<script type="application/ld+json">${schemaJson}</script>`;
          const hash = crypto
            .createHash("sha256")
            .update(schemaJson)
            .digest("base64");
          const cspHash = `sha256-${hash}`;
          console.log(`\n[CSP Automation] Using Site URL: ${SITE_URL}`);
          console.log(`[CSP Automation] Final JSON-LD Hash: ${cspHash}`);
          if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, "utf-8");
            if (html.includes("</head>")) {
              html = html.replace("</head>", `${scriptTag}\n  </head>`);
              fs.writeFileSync(htmlPath, html);
              console.log(
                `[CSP Automation] Injected inline JSON-LD into ${htmlPath}`,
              );
            }
          }
          const headersPath = path.join(distDir, "_headers");
          if (fs.existsSync(headersPath)) {
            let headers = fs.readFileSync(headersPath, "utf-8");
            headers = headers.replace(
              /script-src 'self'/,
              `script-src 'self' '${cspHash}'`,
            );
            fs.writeFileSync(headersPath, headers);
            console.log(`[CSP Automation] Updated ${headersPath}`);
          }
          const vercelPath = path.join(distDir, "vercel.json");
          const vercelConfig = {
            headers: [
              {
                source: "/(.*)",
                headers: [
                  {
                    key: "Content-Security-Policy",
                    value: `default-src 'none'; script-src 'self' '${cspHash}'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`,
                  },
                ],
              },
            ],
          };
          fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2));
          console.log(`[CSP Automation] Created ${vercelPath}`);
        },
      };
    })(),
  ],
  build: {
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
      },
    },
  },
});
