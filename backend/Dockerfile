FROM node:18-slim

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala todas as dependências
RUN npm install

# Copia apenas o schema do prisma primeiro para gerar o cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Garante permissão de execução para binários locais do npm
RUN chmod -R +x node_modules/.bin

EXPOSE 3001

# Sincroniza o banco de dados e inicia o servidor
CMD npx prisma generate && npx prisma db push --accept-data-loss && npx tsx src/server.ts
