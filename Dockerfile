FROM node:20-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./

FROM base AS development

RUN npm install

COPY . .

RUN npm run build

FROM base AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}
ENV API_PORT=3000 \
    POSTGRES_HOST=dpg-cqd4stmehbks73bpl570-a.oregon-postgres.render.com \
    POSTGRES_PORT=5432 \
    POSTGRES_DATABASE=fiaptech \
    POSTGRES_USER=secretuser \
    MERCADO_PAGO_EXTERNAL_CAIXA_ID=CAIXAEID \
    MERCADO_PAGO_VENDEDOR_USER_ID=1910982443 \
    MERCADO_PAGO_SPONSOR_USER_ID=1907353240 \
    MERCADO_PAGO_ACCESS_TOKEN=APP_USR-5504098690787496-073020-6da0ebc9754ae0fd13bc293c45aa33d2-1910982443 \
    MERCADO_PAGO_BASE_URL=https://api.mercadopago.com \
    MERCADO_PAGO_API_VERSION=v1 \
    MERCADO_PAGO_NOTIFICATION_URL=http://af5166cc660e144ae91976bf162a04e1-2105560626.us-east-1.elb.amazonaws.com/

RUN npm install --only=production

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
