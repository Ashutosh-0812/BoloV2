# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json first
COPY package*.json ./

# Downgrade npm to v6 to avoid idealTree bug
RUN npm install -g npm@6

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your application runs on
EXPOSE 8080

# Command to run your application
CMD ["npm", "start"]