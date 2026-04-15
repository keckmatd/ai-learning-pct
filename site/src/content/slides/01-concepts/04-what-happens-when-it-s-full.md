---
title: "What Happens When It's Full?"
part: 1
order: 4
layout: "code"
sourceFile: "context-windows"
---

## What Happens When It's Full?

**Old messages get dropped** (truncated from the beginning)

```
Turn 1:  [Instructions][Msg 1]
Turn 5:  [Instructions][Msg 1][Msg 2][Msg 3][Msg 4][Msg 5]
Turn 20: [Instructions][Msg 12][Msg 13]...[Msg 20]
                       ↑
                  Msgs 1-11 are GONE
```

**This is why:**
- AI "forgets" things from early in long conversations
- Starting fresh can help when things get confused
- Important context should be repeated or put in system instructions