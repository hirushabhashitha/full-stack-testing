# 1. Lightweight Node image එක භාවිත කිරීම
FROM node:20

# 2. Container එක ඇතුළේ work directory එක /app කිරීම
WORKDIR /app

# 3. package files කොපි කර dependencies install කිරීම
COPY package*.json ./
RUN npm install

# 4. ඉතිරි frontend code සියල්ල container එකට කොපි කිරීම
COPY . .

# 5. Web App එක run වන port එක (Next.js සඳහා සාමාන්‍යයෙන් 3000) expose කිරීම
EXPOSE 3000

# 6. Web App එක run කිරීම සඳහා command එක (Next.js සඳහා නම් npm run dev හෝ npm start)
CMD ["npm", "run", "dev"]