# Stage 1: Build the React client
FROM node:22-alpine AS client-build
WORKDIR /app/client

# Copy package files
COPY synergydistrict.client/package*.json ./

# Install dependencies
RUN npm ci

# Copy client source
COPY synergydistrict.client/ ./

# Build the client
RUN npm run build

# Stage 2: Build the .NET server
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS server-build
WORKDIR /app/server

# Copy csproj and restore
COPY SynergyDistrict.Server/*.csproj ./
RUN dotnet restore

# Copy server source
COPY SynergyDistrict.Server/ ./

# Copy built client files to wwwroot
COPY --from=client-build /app/client/dist ./wwwroot

# Build the server
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=server-build /app/publish .

# Create directory for database
RUN mkdir -p /app/data

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "SynergyDistrict.Server.dll"]
