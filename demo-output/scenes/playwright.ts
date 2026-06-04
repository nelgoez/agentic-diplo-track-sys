import { $ } from "bun";

const dtsRoot = "D:/Nahuel/Proyectos/UPEX/diploma-tracking-sys";

console.log("[scene:playwright] Running E2E tests (headed)...");

try {
  await $`cd ${dtsRoot}/client && npx playwright test --headed --timeout=30000 2>&1`.nothrow();
  console.log("[scene:playwright] E2E tests completed");
} catch (err: any) {
  console.log("[scene:playwright] E2E tests had failures (expected for demo)");
}

console.log("[scene:playwright] Running Bun unit tests...");

try {
  await $`cd ${dtsRoot}/server && bun test --timeout 15000 2>&1`.nothrow();
  console.log("[scene:playwright] Unit tests completed");
} catch (err: any) {
  console.log("[scene:playwright] Unit tests had failures (expected for demo)");
}
