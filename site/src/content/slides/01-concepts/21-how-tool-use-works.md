---
title: "How Tool Use Works"
part: 1
order: 21
layout: "code"
sourceFile: "mcp-and-tools"
---

## How Tool Use Works

```
┌─────────────────────────────────────────┐
│              AI Model                   │
│                                         │
│   "I need current weather data..."      │
│   "I should call the weather tool"      │
│                                         │
│   → Outputs: tool_call(weather, loc)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Tool Execution                │
│                                         │
│   weather_api.get("Columbus, OH")       │
│   → Returns: {temp: 72, condition: sun} │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│              AI Model                   │
│                                         │
│   [Sees tool result in context]         │
│   → Generates human-friendly response   │
└─────────────────────────────────────────┘
```

**The AI doesn't execute tools** - it asks to use them, something else executes, result comes back.