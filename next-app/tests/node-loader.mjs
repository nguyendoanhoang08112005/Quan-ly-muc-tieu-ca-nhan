import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = path.resolve(import.meta.dirname, "..");
const srcRoot = path.join(projectRoot, "src");
const serverOnlyStubUrl = pathToFileURL(
  path.join(projectRoot, "tests", "server-only-stub.mjs")
).href;

function resolveWithExtensions(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js"),
    path.join(basePath, "index.mjs")
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: serverOnlyStubUrl
    };
  }

  if (specifier.startsWith("@/")) {
    const resolvedPath = resolveWithExtensions(
      path.join(srcRoot, specifier.slice(2))
    );

    if (!resolvedPath) {
      throw new Error(`Could not resolve alias specifier: ${specifier}`);
    }

    return {
      shortCircuit: true,
      url: pathToFileURL(resolvedPath).href
    };
  }

  if (
    (specifier.startsWith("./") ||
      specifier.startsWith("../") ||
      specifier.startsWith("/")) &&
    path.extname(specifier) === ""
  ) {
    const parentPath = context.parentURL
      ? path.dirname(new URL(context.parentURL).pathname)
      : projectRoot;
    const resolvedPath = resolveWithExtensions(
      specifier.startsWith("/")
        ? specifier
        : path.resolve(parentPath, specifier)
    );

    if (resolvedPath) {
      return {
        shortCircuit: true,
        url: pathToFileURL(resolvedPath).href
      };
    }
  }

  return nextResolve(specifier, context);
}
