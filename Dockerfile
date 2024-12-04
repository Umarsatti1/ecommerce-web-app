# Stage 1: Build frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install
RUN npm run build

# Stage 2: Build backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app
COPY *.sln ./
COPY backend/*.csproj ./backend/
RUN dotnet restore
COPY backend/ ./backend/
RUN dotnet publish -c Release -o /app/backend/out

# Stage 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/backend/out ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot
ENV DB_CONNECTION_STRING=$DB_CONNECTION_STRING
EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]
