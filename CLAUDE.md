# Development Rules for Mythrill VTT

## MCP Server Usage Guidelines

### Context7 MCP
- **Use when**: Need up-to-date documentation or API references
- **Triggers**: 
  - Library/API questions (React, Firebase, Socket.io, Zustand, etc.)
  - Configuration examples
  - Setup instructions
  - "How do I..." questions about existing libraries
- **Examples**:
  - "Configure Firebase auth with React Router v6"
  - "Socket.io room management best practices"
  - "Zustand middleware for state persistence"

### Playwright MCP
- **Use when**: Browser automation, UI testing, or frontend debugging
- **Triggers**:
  - E2E testing needs
  - UI component testing
  - Performance profiling
  - Visual regression testing
  - Multi-browser compatibility checks
- **Examples**:
  - "Test spell card drag-and-drop functionality"
  - "Verify token positioning across Chrome/Firefox"
  - "Analyze dashboard load performance"

### Filesystem MCP
- **Use when**: Reading, searching, or manipulating project files
- **Triggers**:
  - Code navigation
  - File searching (Glob, grep operations)
  - Reading multiple files
  - Creating new components/modules
  - Bulk file operations
- **Restrictions**: Only access `D:/Mythrill/Descension` directory
- **Examples**:
  - "Find all components using Firebase auth"
  - "Read state management files in store/"
  - "Search for WebSocket connection logic"

### Memory MCP
- **Use when**: Need to maintain context across sessions or recall decisions
- **Triggers**:
  - Complex multi-step development tasks
  - Architectural decisions that need persistence
  - Project-specific conventions
  - Recurring patterns or solutions
- **Examples**:
  - "Remember our state management architecture"
  - "Store multiplayer synchronization patterns"
  - "Recall our Firebase security rules setup"

### Sequential Thinking MCP
- **Use when**: Complex problem-solving or architectural decisions
- **Triggers**:
  - Designing new features
  - Refactoring large systems
  - Performance optimization strategies
  - Security considerations
  - Multi-layered architecture problems
- **Examples**:
  - "Design spell collision detection system"
  - "Plan real-time state synchronization strategy"
  - "Evaluate performance bottlenecks in VTT"

## General Development Guidelines

### Code Quality
- Follow existing code patterns and conventions
- Write clear, self-documenting code
- Add meaningful comments for complex logic
- Maintain consistent naming conventions
- Keep components focused and modular

### React/VTT-Specific Rules
- Use Zustand for global state management
- Firebase for real-time data and authentication
- Socket.io for multiplayer events
- React Router v6 for navigation
- Bootstrap for responsive UI components

### File Organization
```
vtt-react/src/
  components/     - Reusable UI components
  pages/          - Page-level components
  store/          - Zustand stores
  services/        - API and external service integrations
  utils/           - Helper functions
  hooks/           - Custom React hooks
```

### State Management
- Use Zustand for complex state
- Local state for simple UI state
- Firebase real-time listeners for shared state
- Socket.io events for immediate multiplayer updates

### Security
- Firebase security rules for data access
- Input sanitization for all user data
- Socket.io authentication on connection
- Environment variables for sensitive config

## MCP Integration Best Practices

1. **Always** use Context7 before implementing new library features
2. **Use** Playwright for all UI changes that affect user experience
3. **Leverage** Memory for architectural consistency across sessions
4. **Apply** Sequential Thinking for complex feature design
5. **Utilize** Filesystem for efficient code navigation and bulk operations

## Common Workflows

### Adding New Feature
1. Use Memory to recall project architecture
2. Use Context7 for library/API documentation
3. Use Sequential Thinking for design decisions
4. Use Filesystem to read relevant existing code
5. Write implementation
6. Use Playwright for testing

### Debugging Issue
1. Use Filesystem to search for related code
2. Use Context7 for debugging techniques
3. Use Sequential Thinking for root cause analysis
4. Fix the issue
5. Use Playwright to verify fix

### Refactoring Code
1. Use Filesystem to identify affected files
2. Use Sequential Thinking for refactoring strategy
3. Use Context7 for best practices
4. Implement refactoring
5. Use Playwright for regression testing

## Automatic Triggers

**Always invoke Context7 when:**
- Implementing library features
- Configuring external services
- Following API documentation
- Writing setup/installation code

**Always use Sequential Thinking when:**
- Designing multi-component systems
- Making architectural decisions
- Solving complex technical problems
- Evaluating performance implications

**Always use Playwright when:**
- Modifying UI components
- Changing user flows
- Fixing visual bugs
- Implementing new user interactions
