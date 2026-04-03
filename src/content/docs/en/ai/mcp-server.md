---
title: "MCP Server"
description: "Connect Claude Desktop and other AI clients to your inSCADA system"
sidebar:
  order: 2
---

inSCADA MCP Server bridges AI assistants (Claude, VS Code Copilot, Cursor, etc.) directly to your inSCADA SCADA system. Via [Model Context Protocol (MCP)](https://modelcontextprotocol.io), 38 tools enable live value reading, alarm monitoring, script writing, historical data analysis, chart generation, and more.

> **Note:** This MCP server is designed for **inSCADA JDK11** edition.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that enables AI assistants to communicate with external systems in a secure, standardized way. With MCP:

- The AI assistant accesses the inSCADA API directly
- Users give commands in natural language; the AI calls the appropriate tools in the background
- Dangerous operations (writing values, running scripts) require user confirmation
- All communication stays on the local machine — no data is sent to third parties

## Installation

Two installation methods are available:

### Method 1: Extension File (MCPB)

The easiest installation method. Uses a pre-built extension file designed for Claude Desktop.

1. Download `inscada-mcp-server.zip` from [inscada.com/download](https://inscada.com/download/)
2. Extract the ZIP and double-click the `.mcpb` file — Claude Desktop opens automatically
3. Fill in the form:
   - **inSCADA URL**: Server address (e.g. `http://localhost:8081` or `https://server:8082`)
   - **Username**: inSCADA login username
   - **Password**: inSCADA login password
4. Done! The extension appears in Claude Desktop with its icon and description.

![Claude Desktop — inSCADA MCP Extension settings](../../../../assets/docs/mcp-extension-settings.png)

**Advantages:**
- One-click installation, no JSON file editing needed
- Icon, description, and settings panel visible in Claude Desktop
- Passwords entered in a masked GUI form
- Update by downloading and installing a new `.mcpb` file

### Method 2: JSON Configuration

Suitable for developers and CI/CD environments. You manually edit the Claude Desktop config file.

**Config file location:**
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

Add the following JSON to the config file:

```json
{
  "mcpServers": {
    "inscada": {
      "command": "npx",
      "args": ["-y", "@inscada/mcp-server"],
      "env": {
        "INSCADA_API_URL": "http://localhost:8081",
        "INSCADA_USERNAME": "your_username",
        "INSCADA_PASSWORD": "your_password"
      }
    }
  }
}
```

Restart Claude Desktop.

**Advantages:**
- `npx` automatically downloads the latest version on each run
- Compatible with other MCP clients (VS Code Copilot, Cursor, Windsurf)
- Multiple inSCADA servers can be configured
- Flexible configuration via environment variables

### Installation Methods Comparison

| | Extension (.mcpb) | JSON Config |
|---|---|---|
| **Setup** | Double-click + GUI form | Edit JSON file manually |
| **UI** | Icon, description, settings panel | Tools only, no visual UI |
| **Credentials** | GUI form, passwords masked | Plain text in JSON |
| **Updates** | Download new .mcpb | Update JSON or `npx` fetches latest |
| **Compatibility** | Claude Desktop only | All MCP clients |
| **Best for** | End users, operators | Developers, CI/CD |

## Requirements

- [Node.js](https://nodejs.org) 18 or higher
- A running inSCADA server (JDK11 edition)
- An MCP-capable AI client (Claude Desktop, VS Code Copilot, Cursor, etc.)

## Tools

MCP Server includes 38 tools grouped into 8 categories:

- **Space & Data** (10) — Space, project, variable, variable search, script, connection management
- **Animation** (2) — Animation listing and details
- **SCADA Operations** (10) — Live values, alarms, connection status, historical data
- **Charts** (5) — Line, bar, gauge, multi-series, forecast charts
- **Custom Menu** (6) — Menu CRUD operations (template-based creation supported)
- **Generic API** (3) — Discover and call 625+ endpoints
- **Export** (1) — Excel file generation
- **Guide** (1) — Script rules, animation types, best practices

For detailed parameters and usage: [Tools Reference](/docs/en/ai/tools-reference/)

For usage scenarios, prompt examples, and token optimization: [Usage Guide](/docs/en/ai/mcp-usage-guide/)

## Security

### Dangerous Tools
The following tools affect real equipment and require **user confirmation** on every use:

- **`inscada_set_value`** — Writes values to real equipment (PLC, inverter, etc.)
- **`inscada_run_script`** — Executes server-side scripts
- **`update_script`** — Modifies script code
- **`inscada_api`** (POST/PUT/DELETE) — Modifies data via generic API

These tools are marked with MCP safety annotations (`destructiveHint: true`). The AI client prompts for user confirmation before calling them.

### Credentials
- Credentials are stored only on the local machine (config file or Claude Desktop settings)
- Session tokens are kept in memory and discarded on exit
- No data is sent to third parties

## npm Package

MCP Server is published as open source on npm:

```bash
npm install -g @inscada/mcp-server
```

Or run directly with `npx`:

```bash
npx -y @inscada/mcp-server
```

**Package:** [@inscada/mcp-server](https://www.npmjs.com/package/@inscada/mcp-server)
**GitHub:** [inscada-app/mcp-desktop-extension](https://github.com/inscada-app/mcp-desktop-extension)

## Telemetry

MCP Server collects anonymous usage statistics for product improvement:

- Which tools are called and how often
- Error rates
- Session duration

**Data NOT collected:**
- SCADA values, variable names, or project information
- Username, password, or personal information
- Messages sent to or responses from the AI assistant

Telemetry is fully anonymous and optional.

## Troubleshooting

### "Node.js not found" Error
Make sure Node.js 18+ is installed: `node --version`

### Connection Error
- Verify the inSCADA server is running
- Ensure the `INSCADA_API_URL` address is correct
- Check firewall or proxy settings

### Tools Not Visible
- Restart Claude Desktop
- Check JSON syntax in the config file
- Run `npx -y @inscada/mcp-server` in terminal to view error messages

### Antivirus Blocking
Some antivirus software may block `.mcpb` files. In that case, download the ZIP format and extract the `.mcpb` file, or use the JSON configuration method.
