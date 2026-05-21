import { tool } from "@opencode-ai/plugin"
import { readFileSync, existsSync } from "fs"
import { resolve, join } from "path"

export const atFile = tool({
  description:
    "Resolve @file references to load file contents into context. When you see @path/to/file.md, call this tool with that path (including the leading @). Returns the file contents as text.",
  args: {
    path: tool.schema
      .string()
      .describe(
        "The full @ reference including @ prefix, e.g. '@.context/PBI/user-management/SESSION-PROMPT.md'. Relative to the project root."
      ),
  },
  async execute({ path }, { directory }) {
    const projectRoot = directory

    const relativePath = path.startsWith("@") ? path.slice(1) : path

    const candidates = [resolve(projectRoot, relativePath)]

    if (relativePath.startsWith(".context/")) {
      candidates.push(resolve(projectRoot, relativePath))
    }

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        const content = readFileSync(candidate, "utf-8")
        const label = relativePath
        return `--- BEGIN ${label} ---\n${content}\n--- END ${label} ---`
      }
    }

    return `File not found: ${relativePath}. Tried: ${candidates.join(", ")}`
  },
})
