# Базовый образ с Node.js
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# 1) Копируем только package*.json — для кеша зависимостей
COPY package*.json ./

# 2) Устанавливаем зависимости (production + dev для сборки)
RUN npm ci

# 3) Копируем весь проект внутрь контейнера
COPY . .

# 4) Собираем Next.js в production-режиме
RUN npm run build

# Прод-режим
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Порт, который будет слушать контейнер
EXPOSE 3000

# 5) Стартуем прод-сервер Next.js
CMD ["npm", "run", "start"]
