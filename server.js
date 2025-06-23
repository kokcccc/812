const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Статика
app.use(express.static(__dirname));

// Регистрация
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  if (users.find(u => u.username === username)) {
    return res.status(400).send('Пользователь уже существует');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  users.push({ username, password: hashedPassword, isAdmin: false });
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
  res.sendStatus(200);
});


// Авторизация
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).send('Неверные данные');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Неверные данные');

  res.cookie('username', username);
  res.cookie('isAdmin', user.isAdmin);
  res.json({ success: true });
});

// Отправка заявок
app.post('/api/submit', (req, res) => {
  const username = req.cookies.username;
  if (!username) return res.sendStatus(401);

  const { programs } = req.body;
  const requests = JSON.parse(fs.readFileSync('./requests.json', 'utf-8'));
  requests.push({ username, programs, time: Date.now() });
  fs.writeFileSync('./requests.json', JSON.stringify(requests, null, 2));
  res.sendStatus(200);
});

// Просмотр заявок (только админам)
app.get('/api/admin/requests', (req, res) => {
  if (req.cookies.isAdmin !== 'true') return res.sendStatus(403);

  const requests = JSON.parse(fs.readFileSync('./requests.json', 'utf-8'));
  res.json(requests);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
