FROM node:18-slim

# Instalar dependências necessárias para o Prisma no Linux
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo o Prisma CLI)
RUN npm install

# Copia apenas o schema do prisma primeiro para gerar o cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o restante do código
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
