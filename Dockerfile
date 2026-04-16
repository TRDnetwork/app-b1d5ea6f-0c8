```dockerfile
# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build the frontend assets
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Command to run the application
CMD ["npm", "start"]
```