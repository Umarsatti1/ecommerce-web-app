FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["backend/backend.csproj", "./"]
RUN dotnet restore "./backend.csproj"
COPY . .
WORKDIR /src/backend
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY backend/wwwroot ./wwwroot
ENV ASPNETCORE_URLS=http://+:5000
CMD ["dotnet", "backend.dll"]
