# Context7 Integration

This project has integrated Context7, an MCP (Model Context Protocol) server that provides up-to-date documentation and code examples for AI coding assistants.

## What is Context7?

Context7 pulls up-to-date, version-specific documentation and code examples straight from the source and places them directly into your AI assistant's prompt context.

## How to Use Context7

When working with AI coding assistants like Cursor, Claude Desktop, VS Code with Copilot, etc., you can use Context7 by adding `use context7` to your prompts:

```
Create a React component that fetches data from an API. use context7
```

```
How do I implement authentication with NextAuth.js? use context7
```

## Benefits

- Get up-to-date documentation and code examples
- Avoid outdated or hallucinated APIs
- Get version-specific information for the libraries you use

## Configuration

Context7 is configured in the `mcp.json` file at the root of the project. The MCP server is started automatically when you use an AI coding assistant that supports the Model Context Protocol.

## More Information

For more information about Context7, visit:
- [Context7 GitHub Repository](https://github.com/upstash/context7)
- [Context7 Website](https://context7.com)
