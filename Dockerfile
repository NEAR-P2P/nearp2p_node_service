# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
# Using --legacy-peer-deps to avoid potential peer dependency conflicts
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Make port 3070 available to the world outside this container
EXPOSE 3070

# Define the command to run the app
CMD ["node", "server.js"]
