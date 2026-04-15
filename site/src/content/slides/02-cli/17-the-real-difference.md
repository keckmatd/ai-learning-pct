---
title: "The Real Difference"
part: 2
order: 17
layout: "diagram"
sourceFile: "browser-vs-cli"
---

## The Real Difference

### Browser: Conversation in a Sandbox

```mermaid
flowchart LR
    subgraph BROWSER["🌐 Browser AI"]
        direction TB
        Y["👤 You"]
        A["🤖 AI"]
        T["🔒 Limited tools"]
        Y <--> A <--> T
    end
    L["❌ Can't touch your files<br/>❌ Can't run your code<br/>❌ Can't access your systems<br/>☁️ Lives in their cloud"]
    BROWSER --- L
```

**You upload TO it.** It can't reach out to your world.