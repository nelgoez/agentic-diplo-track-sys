# Educational Guide: Business Model Canvas & Market Context

> Reference doc for the Constitution phase — foundational business modeling.
> Source: `.books/fase-1-constitution/` (business-model.MANUAL.md + market-context.MANUAL.md)

---

## 1. Business Model Canvas — The 9 Blocks

The Business Model Canvas is a visual framework that describes how an organization creates, delivers, and captures value. It has 9 interconnected blocks:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BUSINESS MODEL CANVAS                       │
├─────────────────┬─────────────────┬───────────────┬─────────────────┤
│  8. KEY         │  7. KEY         │  2. VALUE     │  4. CUSTOMER    │
│  PARTNERS       │  ACTIVITIES     │  PROPOSITIONS │  RELATIONSHIPS  │
│                 │                 │               │                 │
│  ├─Providers    │  ├─Development  │  ├─What value │  ├─Self-service │
│  ├─Integrations │  ├─Acquisition  │  │ do we      │  ├─Automated    │
│  ├─Distribution │  ├─Operations   │  │ offer?     │  ├─Assisted     │
│  └─Content      │  └─Support      │  └─Why us?    │  ├─Dedicated    │
│                 ├─────────────────┤               │  └─Community    │
│                 │  6. KEY         │               ├─────────────────┤
│                 │  RESOURCES      │               │  3. CHANNELS    │
│                 │                 │               │                 │
│                 │  ├─Physical     │               │  Awareness →   │
│                 │  ├─Intellectual │               │  Evaluation →  │
│                 │  ├─Human        │               │  Purchase →    │
│                 │  └─Financial    │               │  Delivery →    │
│                 │                 │               │  Post-sale     │
├─────────────────┴─────────────────┴───────────────┴─────────────────┤
│                 │                                                       │
│  9. COST        │                  5. REVENUE STREAMS                  │
│  STRUCTURE      │                                                       │
│                 │  ├─Subscription ├─Freemium ├─Pay-per-use             │
│  ├─Fixed costs  │  ├─One-time     ├─Marketplace ├─Advertising          │
│  ├─Variable     │                                                       │
│  └─Break-even   │                                                       │
└─────────────────┴─────────────────────────────────────────────────────┘

                               1. CUSTOMER SEGMENTS
                               For whom do we create value?
```

### Block 1: Customer Segments
Define 2-3 specific user groups. For each: demographics/role, primary goal, pain points. Do not confuse "users" with "customers" — the user uses the product; the customer pays for it.

### Block 2: Value Propositions
For each segment, complete: "For [SEGMENT], who has [PROBLEM], our product offers [SOLUTION] that [BENEFIT]. Unlike [ALTERNATIVES], we [DIFFERENTIATOR]."

### Block 3: Channels
Map the customer journey across 5 phases: Awareness → Evaluation → Purchase → Delivery → Post-sale. Identify which channels work for each phase.

### Block 4: Customer Relationships
Choose the relationship type per segment: Self-service, Automated, Personal assistance, Dedicated, Community, or Co-creation.

### Block 5: Revenue Streams
Pick monetization model(s): Subscription, Freemium, Pay-per-use, One-time, Marketplace commission, or Advertising. Include specific pricing tiers for MVP.

### Block 6: Key Resources
Categorize into Physical (infrastructure), Intellectual (codebase, IP), Human (team), and Financial (runway, budget).

### Block 7: Key Activities
List critical activities for delivering value. This clarifies what to focus on vs. what to delegate/automate.

### Block 8: Key Partners
Identify strategic alliances: Providers, Integration partners, Distribution channels, Content partners.

### Block 9: Cost Structure
Estimate fixed costs (monthly) and variable costs (per unit). Calculate break-even point to validate viability.

### MVP Hypotheses
Define 3 testable hypotheses using the format: "We believe [SEGMENT] will pay for [SOLUTION] because [REASON]. We'll know it's true when [MEASURABLE METRIC]."

### Coherence Validation
Cross-check all 9 blocks:
- Value Prop ↔ Customer Segments: Does the value prop solve each segment's pain points?
- Channels ↔ Customer Segments: Are your channels where users actually are?
- Revenue ↔ Value Prop: Will customers pay for this value?
- Key Resources ↔ Key Activities: Do you have the resources to execute?
- Cost Structure ↔ Revenue Streams: Do revenues cover costs?

---

## 2. Market Context Analysis

### Key Concepts
| Term | Meaning |
|------|---------|
| **TAM** | Total Addressable Market — the entire market if you capture 100% |
| **SAM** | Serviceable Addressable Market — the segment you can reach |
| **SOM** | Serviceable Obtainable Market — realistic capture in year 1 |
| **Competitive Landscape** | Map of direct and indirect competitors |
| **Moat** | Competitive advantage hard to replicate |

### Competitive Analysis Process
1. **Direct competitors** (3-5): Same problem, same solution. Document URL, pricing, target, strengths, weaknesses.
2. **Indirect competitors**: Same problem, different solution (e.g., spreadsheets instead of a tool).
3. **Alternatives**: Same outcome, different path (e.g., not automating, outsourcing).
4. **Positioning matrix**: Plot competitors on 2 axes (e.g., Simple↔Complex, SMB↔Enterprise). Look for empty spaces.

### Market Sizing Methods
**Top-Down**: TAM = total companies × avg price/year. SAM = TAM × % using relevant tech. SOM = SAM × realistic capture (1-5% for startups).

**Bottom-Up**: SOM = target clients in year 1 × price. SAM = SOM × 10-20x. TAM = SAM × 5-10x.

### Differentiation Framework
Articulate difference across 3 dimensions:
- **Feature**: Something others don't have (AI, open source, no-code)
- **Focus**: Whom you serve better (startups, enterprise, QA teams)
- **Model**: How you charge differently (usage-based, freemium, per-seat)

### Trends Research Categories
| Category | What to Look For | Sources |
|----------|-----------------|---------|
| Technological | New technologies adopted | Gartner, Forrester |
| Behavioral | How users change | Surveys, Reddit |
| Regulatory | New laws/standards | News, ISO |
| Economic | Budget, hiring trends | LinkedIn, Glassdoor |
| Industry | Consolidation, new players | Crunchbase, TechCrunch |

### Barriers & Risks
Document both barriers you face (established competitors, acquisition cost) and barriers that protect you once inside (switching costs, network effects, integration lock-in).

---

## 3. Template Output

The business model canvas maps to `.context/idea/business-model.md` and market context to `.context/idea/market-context.md`. Both follow the structured templates shown in the source manuals.
