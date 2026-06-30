# Graphify Knowledge Graph — Fast Codebase Context

`graphify-out/graph.json` exists with pre-built knowledge graph (5.2MB, 156KB report).

**Before answering any codebase architecture/file-relationship question:**
- Run `graphify query "<question>"` for BFS traversal
- Run `graphify path "<nodeA>" "<nodeB>"` for shortest path between concepts
- Run `graphify explain "<node>"` for plain-language explanation of a node
- If graphify CLI unavailable, traverse `graphify-out/graph.json` via NetworkX inline

**Do NOT** grep/search files manually for architecture questions. Graph answers faster.
