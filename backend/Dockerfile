# Use the official Python image as the base image
FROM python:3.10-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install --upgrade pip \
    && pip install poetry

# Copy the Python project files into the container at /app
COPY pyproject.toml poetry.lock* /app/

# Configure Poetry:
# - Don’t create a virtual environment inside the container
# - Install all dependencies including dev dependencies if necessary
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of the application
COPY . /app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
