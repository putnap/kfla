FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["KFLA/KFLA.csproj", "KFLA/"]
COPY ["KFLA.Services/KFLA.Services.csproj", "KFLA.Services/"]
COPY ["KFLA.Contract/KFLA.Contract.csproj", "KFLA.Contract/"]
COPY ["KFLA.Persistence.MongoDB/KFLA.Persistence.MongoDB.fsproj", "KFLA.Persistence.MongoDB/"]
RUN dotnet restore "KFLA/KFLA.csproj"
COPY . .
WORKDIR "/src/KFLA"
RUN dotnet build "KFLA.csproj" -o /app

FROM build AS publish
RUN dotnet publish "KFLA.csproj" -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "KFLA.dll"]

