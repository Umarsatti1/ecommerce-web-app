# Use the official .NET SDK for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project files
COPY *.sln ./
COPY backend/*.csproj ./backend/
RUN dotnet restore

# Copy the remaining application files
COPY backend/. ./backend/
WORKDIR /app/backend

# Build the application in Release mode
RUN dotnet publish -c Release -o out

# Use a lightweight runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/backend/out ./

# Copy the frontend dist (now present in backend/wwwroot)
COPY backend/wwwroot /app/backend

# Expose the application port (8080)
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "backend.dll"]
