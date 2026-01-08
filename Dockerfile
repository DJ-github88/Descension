# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY vtt-react/package*.json ./vtt-react/
COPY package.json ./

# Install dependencies
WORKDIR /app/vtt-react
RUN npm ci --force

# Copy source code
COPY vtt-react/ ./

# Set environment variables for production build
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV CI=true
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV REACT_APP_BUILD_MODE=production
ENV REACT_APP_ENV=production
ENV INLINE_RUNTIME_CHUNK=false
ENV BROWSERSLIST_ENV=production

# Build the application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE $PORT

# Start the application
CMD ["sh", "-c", "serve -s build -l $PORT"]
