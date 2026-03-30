# DnD2 Virtual Tabletop

A virtual tabletop application for Dungeons & Dragons and other tabletop RPGs, built with React.

## Features

- Interactive grid system
- Token management
- Spell crafting wizard with WoW-inspired UI
- Character sheets
- Inventory management
- Item generation
- And more!

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DJ-github88/Descension.git
cd DnD2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
cd vtt-react
npm start
```

## MCP Services

This project includes two MCP (Model Context Protocol) services:

1. **Context7 MCP** - Provides up-to-date documentation and code examples for AI coding assistants.
   - See [CONTEXT7.md](CONTEXT7.md) for more information.

2. **Local File MCP Service** - Manages local files for the project.
   - Located in `mcp-service` directory.
   - See [mcp-service/README.md](mcp-service/README.md) for more information.

## Project Structure

- `vtt-react/` - Main React application
  - `src/` - Source code
    - `components/` - React components
    - `store/` - State management (Zustand)
    - `styles/` - CSS styles
  - `public/` - Static assets
- `mcp-service/` - Local file MCP service

## Technologies Used

- React
- Zustand for state management
- React Router
- React Bootstrap
- FontAwesome icons
- Context7 for AI coding assistance

## License

This project is licensed under the MIT License.
