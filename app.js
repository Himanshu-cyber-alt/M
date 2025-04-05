import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Mongo Error:', err));

// Define Schema
const NameSchema = new mongoose.Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Name = mongoose.model('Name', NameSchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Show form + names
app.get('/', async (req, res) => {
  const names = await Name.find().sort({ createdAt: -1 });
  res.render('index', { names });
});

// Handle form
app.post('/add', async (req, res) => {
  const { name } = req.body;
  if (name) {
    await Name.create({ name });
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
