---
description: Resume last session from PBI module context — loads SESSION-PROMPT.md, ROADMAP.md, and PROGRESS.md
agent: plan
---

You are resuming a previously interrupted session for the module `$ARGUMENTS`.

Step 1: Load the current state by reading these files in order:

@.context/PBI/$ARGUMENTS/SESSION-PROMPT.md

If SESSION-PROMPT.md does not exist, read these instead:
@.context/PBI/$ARGUMENTS/ROADMAP.md
@.context/PBI/$ARGUMENTS/PROGRESS.md

Step 2: After loading the context, tell me:

- What module we are working on
- Which story/phase was active
- What the next action is (which ticket to implement)
- Any blockers or open decisions from the last session

Step 3: If the next ticket is clear, offer to:

- Run `/sprint-development {TICKET-ID}` to continue implementation
- Or create the ticket in Jira if it does not exist yet

Step 4: If no SESSION-PROMPT.md or module context exists, check the master plan:
@.context/master-implementation-plan.md

Then suggest the next sprint/story to start based on the roadmap.

Skip SESSION-PROMPT.md if absent — do not error.
