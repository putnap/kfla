## 1. Prepare server side build image
 #
#FROM microsoft/dotnet:2.2-sdk as build-env
#WORKDIR /app
#COPY KFLA/*.csproj ./src/KFLA/
#COPY *.sln ./
#RUN dotnet restore KFLA.sln
 #
##2 Build client-side artifacts
 #
#FROM node:latest as clientBuild
#WORKDIR /src/KFLA
#RUN npm install
#RUN npm run build:dev
 #
##3 Publish final output by merging server-side and client-side artifacts
 #
#FROM build-env as publish
#COPY . ./
#RUN dotnet publish -c Release -o out
#COPY --from=clientBuild ./ClientApp/dist ./src/KFLA/out/ClientApp/dist
 #
## Build runtime image
#FROM microsoft/dotnet:2.2-aspnetcore-runtime
#WORKDIR /app
#COPY --from=publish /app/src/KFLA/out/ .
#EXPOSE 80:80
#ENTRYPOINT ["dotnet", "KFLA.dll"]

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs
ENV CHOKIDAR_USEPOLLING true

WORKDIR /app
EXPOSE 80
EXPOSE 35729

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["KFLA/KFLA.csproj", "KFLA/"]
COPY ["KFLA.Services/KFLA.Services.csproj", "KFLA.Services/"]
COPY ["KFLA.Contract/KFLA.Contract.csproj", "KFLA.Contract/"]
COPY ["KFLA.Persistence.MongoDB/KFLA.Persistence.MongoDB.fsproj", "KFLA.Persistence.MongoDB/"]
RUN dotnet restore "KFLA/KFLA.csproj"
COPY . .
WORKDIR "/src/KFLA"
RUN dotnet build "KFLA.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KFLA.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KFLA.dll"]