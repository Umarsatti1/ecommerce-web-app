# Use the official .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY E-Commerce.sln .              
COPY backend/*.csproj ./backend/   
RUN dotnet restore ./backend
COPY backend/ ./backend/           
WORKDIR /src/backend
RUN dotnet publish -c Release -o /app

# Use the official .NET runtime image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
CMD ["dotnet", "backend.dll"]
