
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app


FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["SignalRServer.csproj", "."]
RUN dotnet restore "./SignalRServer.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "SignalRServer.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SignalRServer.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SignalRServer.dll"]
