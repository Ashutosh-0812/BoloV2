
# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /


# Copy package.json and package-lock.json first
# This allows Docker to use the cache if dependencies don't change
COPY package*.json ./

# Optionally downgrade npm for compatibility (uncomment if needed)
# RUN npm install -g npm@6

# Clean npm cache and install dependencies using npm ci for clean builds
RUN npm cache clean --force && npm install

# Copy the rest of your application code
COPY . .

# Expose the port your application runs on
EXPOSE 8080

# Command to run your application
CMD ["npm", "start"]