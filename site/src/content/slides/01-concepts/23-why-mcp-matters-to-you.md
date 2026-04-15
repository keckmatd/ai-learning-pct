---
title: "Why MCP Matters to You"
part: 1
order: 23
layout: "diagram"
sourceFile: "mcp-and-tools"
---

## Why MCP Matters to You

### For Browser Users
- ChatGPT plugins, Gemini extensions = early tool ecosystems
- Limited to what the platform offers

### For CLI Users (where we're going)
- YOU decide what tools are available
- Connect to your systems: files, databases, APIs
- The harness manages tool access

```mermaid
flowchart TB
    CLI["🖥️ CLI AI + MCP"]
    F["📁 File system tools<br/><i>read/write your actual files</i>"]
    G["🔀 Git tools<br/><i>commit, branch, PR</i>"]
    B["🌐 Browser tools<br/><i>research, scrape</i>"]
    C["🔧 Custom tools YOU build"]
    W["✨ Whatever you need"]

    CLI --> F
    CLI --> G
    CLI --> B
    CLI --> C
    CLI --> W
```