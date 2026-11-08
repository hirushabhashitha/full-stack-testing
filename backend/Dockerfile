# 1. Official lightweight Node image එක භාවිත කිරීම
FROM node:20-alpine

# 2. Container එක ඇතුළේ වැඩ කරන directory එක /app ලෙස සැකසීම
WORKDIR /app

# 3. package.json සහ package-lock.json (package*.json) files කොපි කර dependencies install කිරීම
COPY package*.json ./
RUN npm install

# 4. ඉතිරි backend source code සියල්ල container එකට කොපි කිරීම
COPY . .

# 5. Backend app එක run වන port එක (උදා: 5000) expose කිරීම
EXPOSE 5000

# 6. Backend එක run කිරීමට අවශ්‍ය command එක
CMD ["npm", "run", "dev"]
