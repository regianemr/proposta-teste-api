import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = 3000;

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
      console.log('Conectado ao MongoDB');
  } catch (error) {
      console.log('Erro ao conectar ao MongoDB', error);
  }
}

connectDB();

app.post('/', (req, res) => {
  // res.json();
})

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
})