# Use the official Python 3.8 image as the base image
FROM python:3.9.5-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# # Expose the port the app runs on
EXPOSE 8000
