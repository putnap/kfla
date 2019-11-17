FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["KFLA/KFLA.csproj", "KFLA/"]
COPY ["KFLA.Services/KFLA.Services.csproj", "KFLA.Services/"]
COPY ["KFLA.Contract/KFLA.Contract.csproj", "KFLA.Contract/"]
COPY ["KFLA.Persistence.MongoDB/KFLA.Persistence.MongoDB.fsproj", "KFLA.Persistence.MongoDB/"]
RUN dotnet restore "KFLA/KFLA.csproj"
COPY . .
WORKDIR "/src/KFLA"

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs
RUN dotnet build "KFLA.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KFLA.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80 443
EXPOSE 35729
ENTRYPOINT ["dotnet", "KFLA.dll"]
