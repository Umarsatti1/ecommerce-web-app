# Stage 1: Build the .NET Application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project files and restore dependencies for the backend
COPY backend/*.csproj ./backend/
RUN dotnet restore backend/backend.csproj

# Copy the rest of the backend files and publish the application
COPY backend/. ./backend/
WORKDIR /app/backend
RUN dotnet publish -c Release -o out

# Stage 2: Create the final runtime image for .NET Application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published backend files from the build stage
COPY --from=build /app/backend/out ./backend

# Copy the built frontend assets into the 'wwwroot' folder in the backend
COPY ./backend/wwwroot /app/backend/wwwroot

# Expose the application port (8080)
EXPOSE 8080

# Start the .NET application
ENTRYPOINT ["dotnet", "backend.dll"]
