# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY backend/ .

# Install any needed dependencies specified in package.json
# RUN yarn install
# RUN npm i -g yarn
RUN rm -rf node_modules && yarn

# Copy the current directory contents into the container at /app
# COPY . .

# Make port 3000 available to the world outside the container
EXPOSE 5001

# Define the command to run your application using Yarn
CMD ["node", "dist/server.js"]