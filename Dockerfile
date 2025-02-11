FROM oven/bun:latest

COPY package.json ./
COPY bun.lock ./
COPY src ./src
COPY package.json ./
COPY tsconfig.json ./

RUN bun install

CMD ["bun", "run", "src/index.ts"]

