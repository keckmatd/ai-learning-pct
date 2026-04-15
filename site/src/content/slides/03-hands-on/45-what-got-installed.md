---
title: "What Got Installed"
part: 3
order: 45
layout: "diagram"
sourceFile: "install-guide"
---

## What Got Installed

```mermaid
flowchart TB
    subgraph CONFIG["📁 ~/.config/github-copilot/"]
        L["📋 instructions.md"]
    end
    L -->|"symlink"| I

    subgraph CD["📁 copilot-dotfiles/"]
        I["📋 instructions.md<br/><i>Global context</i>"]
        SK["📂 skills/<br/><i>Reusable workflows</i>"]
        T["📂 templates/<br/><i>Project starters</i>"]
        CS["📂 cheatsheets/<br/><i>Quick reference</i>"]
        E["📂 examples/<br/><i>Sample usage</i>"]
    end
```