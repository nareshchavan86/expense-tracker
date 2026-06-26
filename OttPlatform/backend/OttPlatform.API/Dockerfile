FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["OttPlatform.API/OttPlatform.API.csproj", "OttPlatform.API/"]
COPY ["OttPlatform.Core/OttPlatform.Core.csproj", "OttPlatform.Core/"]
COPY ["OttPlatform.Application/OttPlatform.Application.csproj", "OttPlatform.Application/"]
COPY ["OttPlatform.Infrastructure/OttPlatform.Infrastructure.csproj", "OttPlatform.Infrastructure/"]
RUN dotnet restore "OttPlatform.API/OttPlatform.API.csproj"
COPY . .
WORKDIR "/src/OttPlatform.API"
RUN dotnet build "OttPlatform.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OttPlatform.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OttPlatform.API.dll"]
