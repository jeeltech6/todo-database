const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://jeel:jeel@cluster0.u0yrxd6.mongodb.net/';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
});
const Task = mongoose.model('Task', taskSchema);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.render('index', { tasks });
});

app.post('/add', async (req, res) => {
  const { title, priority } = req.body;
  if (!title) return res.redirect('/');
  await Task.create({ title, priority });
  res.redirect('/');
});

app.post('/edit/:id', async (req, res) => {
  const { title, priority } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title, priority });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(3000, () => console.log('Server started on port 3000'));
