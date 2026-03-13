import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { generatePersonSchema } from "./src/schema/person";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_PATH = process.env.VITE_BASE || "/";
const SITE_URL =
  process.env.VITE_SITE_URL || "https://ajmalbuv.github.io/0day/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    (() => {
      let lastCspHash = "";
      let avatarPath = "";
      return {
        name: "jsonld-csp-automation",
        generateBundle(_options, bundle) {
          for (const [fileName] of Object.entries(bundle)) {
            if (fileName.includes("avatar") && fileName.endsWith(".webp")) {
              avatarPath = (BASE_PATH + fileName).replace(/\/+/g, "/");
              console.log(
                `[CSP Automation] Found hashed avatar: ${avatarPath}`,
              );
              break;
            }
          }
        },
        transformIndexHtml(html) {
          if (!avatarPath)
            avatarPath = `${BASE_PATH}assets/avatar.webp`.replace(/\/+/g, "/");
          const schemaObj = generatePersonSchema(avatarPath, SITE_URL);
          const schemaJson = JSON.stringify(schemaObj);
          const scriptTag = `<script type="application/ld+json">${schemaJson}</script>`;
          const hash = crypto
            .createHash("sha256")
            .update(schemaJson)
            .digest("base64");
          lastCspHash = `sha256-${hash}`;
          console.log(`\n[CSP Automation] Site URL: ${SITE_URL}`);
          console.log(`[CSP Automation] Avatar Path: ${avatarPath}`);
          console.log(`[CSP Automation] Final JSON-LD Hash: ${lastCspHash}`);
          if (html.includes("</head>")) {
            console.log(
              "[CSP Automation] Injected JSON-LD into index.html via transformIndexHtml",
            );
            return html.replace("</head>", `${scriptTag}\n  </head>`);
          }
          return html;
        },

        closeBundle() {
          const distDir = path.resolve(__dirname, "dist");
          const headersPath = path.join(distDir, "_headers");
          if (fs.existsSync(headersPath)) {
            let headers = fs.readFileSync(headersPath, "utf-8");
            headers = headers.replace(
              /script-src 'self'/,
              `script-src 'self' '${lastCspHash}'`,
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
                    value: `default-src 'none'; script-src 'self' '${lastCspHash}'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`,
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
