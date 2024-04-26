# 1- build frontend
FROM node:21-alpine AS fe
WORKDIR /app
COPY /frontend/ .
RUN npm ci
RUN npm run build

# 2- build backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY /backend/*.csproj .
RUN dotnet restore

COPY /backend .
COPY --from=fe /app/ ./wwwroot

RUN dotnet publish -c release -o /published --no-restore

# 3- final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /published .
ENTRYPOINT ["dotnet", "e-commerce-backend.dll"]
