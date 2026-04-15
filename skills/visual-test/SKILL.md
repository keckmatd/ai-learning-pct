---
name: visual-test
description: Run browser-based visual testing using MCP browser automation.
allowed-tools:
  - bash
  - view
  - create
  - grep
  - glob
---
# Visual Test

Run browser-based visual testing using MCP browser automation.

## What This Does

Leverages Puppeteer MCP or Chrome DevTools MCP to:
1. Open a browser to a specified URL
2. Perform automated interactions
3. Capture screenshots for verification
4. Report visual differences or issues

## Prerequisites

One of these MCP servers must be configured:
- `puppeteer-mcp-claude` - Full Puppeteer automation
- `chrome-devtools-mcp` - Chrome DevTools Protocol (you already have this!)

## Usage

```
/visual-test <url> [--full-page] [--mobile] [--interactions <steps>]
```

## Arguments

- `url` (required): URL to test
- `--full-page`: Capture entire scrollable page
- `--mobile`: Emulate mobile viewport
- `--interactions`: JSON file with interaction steps

## Instructions

When the user runs `/visual-test`, do the following:

### Step 1: Check MCP Availability

Look for available browser MCP tools. You likely have chrome-devtools MCP available via:
- `mcp__chrome-devtools__navigate_page`
- `mcp__chrome-devtools__take_screenshot`
- `mcp__chrome-devtools__take_snapshot`
- `mcp__chrome-devtools__click`
- `mcp__chrome-devtools__fill`

If no browser MCP is available:
```
⚠ No browser MCP server detected.

To enable visual testing, install one of:

1. Chrome DevTools MCP (recommended):
   claude mcp add chrome-devtools -- npx @anthropic-ai/chrome-devtools-mcp

2. Puppeteer MCP:
   npx puppeteer-mcp-claude install

See: https://github.com/anthropics/chrome-devtools-mcp
```

### Step 2: Navigate to URL

Using chrome-devtools MCP:
```
Use mcp__chrome-devtools__navigate_page with url parameter
```

Wait for page load to complete.

### Step 3: Capture Baseline

Take initial screenshot:
```
Use mcp__chrome-devtools__take_screenshot
```

Options:
- `fullPage: true` for full page capture
- Specific element via `uid` from snapshot

### Step 4: Perform Interactions (if specified)

If `--interactions` provided, execute steps like:
```json
{
  "steps": [
    {"action": "click", "selector": "#login-button"},
    {"action": "fill", "selector": "#email", "value": "test@example.com"},
    {"action": "wait", "text": "Welcome"},
    {"action": "screenshot", "name": "after-login"}
  ]
}
```

For each step, use appropriate MCP tool:
- `click` → `mcp__chrome-devtools__click` with uid
- `fill` → `mcp__chrome-devtools__fill` with uid and value
- `wait` → `mcp__chrome-devtools__wait_for` with text
- `screenshot` → `mcp__chrome-devtools__take_screenshot`

### Step 5: Report Results

```
📸 Visual Test Results: [URL]

Screenshots captured:
1. initial.png - Homepage loaded
2. after-login.png - Post-authentication state

Observations:
- Page loaded in ~1.2s
- All interactive elements accessible
- No console errors detected

Issues found:
- [any issues or "None"]

Screenshots saved to: [location]
```

### Step 6: Mobile Testing (if --mobile)

Resize viewport before testing:
```
Use mcp__chrome-devtools__resize_page with mobile dimensions
```

Common mobile viewports:
- iPhone SE: 375x667
- iPhone 14: 390x844
- Pixel 5: 393x851

## Example Workflows

### Basic Page Verification
```
/visual-test http://localhost:4200
```
- Opens page
- Takes screenshot
- Reports any console errors

### Form Flow Testing
```
/visual-test http://localhost:4200/login --interactions login-flow.json
```
Where `login-flow.json`:
```json
{
  "steps": [
    {"action": "snapshot", "name": "login-form"},
    {"action": "fill", "selector": "[name=email]", "value": "test@test.com"},
    {"action": "fill", "selector": "[name=password]", "value": "password123"},
    {"action": "click", "selector": "button[type=submit]"},
    {"action": "wait", "text": "Dashboard"},
    {"action": "screenshot", "name": "dashboard"}
  ]
}
```

### Responsive Testing
```
/visual-test http://localhost:4200 --mobile --full-page
```

## Platform Notes

### Linux (Native)
- Works out of the box with headless Chrome
- Can run headful with display

### macOS
- Works natively

### Windows
- Works natively

### WSL
- **Headless mode works** - no issues
- **Headful mode** requires:
  - X server (VcXsrv) on Windows, OR
  - Remote debugging to Windows Chrome

For WSL headful, set in browser MCP config:
```json
{
  "puppeteer": {
    "args": ["--no-sandbox", "--disable-setuid-sandbox"]
  }
}
```

Or use Chrome DevTools MCP which connects to an existing Chrome instance.

## Troubleshooting

### "No browser detected"
- Ensure MCP server is running
- Check `claude mcp list` for active servers
- Restart Claude Code after MCP changes

### "Failed to launch browser"
- WSL: Check X server or use headless
- Try with `--no-sandbox` flag
- Ensure Chrome/Chromium is installed

### "Element not found"
- Take a snapshot first: `mcp__chrome-devtools__take_snapshot`
- Find the correct `uid` from snapshot
- Element may be in iframe or shadow DOM
