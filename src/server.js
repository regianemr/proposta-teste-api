import dotenv from 'dotenv';
import express from 'express';
import { nanoid } from 'nanoid';
import connectDB from './config/database.js';
import clientModel from './models/client.js';
import proposalModel from './models/proposal.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
console.log(PORT)

app.use(express.json())

app.post("/clients", async (req, res) => {
  try {
    const client = req.body;
    client.id = nanoid()
    const newClient = await clientModel.create(client);
    res.json(newClient);
    
  } catch (error) {
    console.log('error', error);
    res.json({error});
  }
})

app.get("/clients/:id", async (req, res) => {
  try {
    const id = req.params.id
    const clients = await clientModel.find({id})
    console.log(clients)
    res.json(clients)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})

app.post("/proposals", async (req, res) => {
  try {
    const proposal = req.body;
    proposal.id = nanoid()
    const newProposals = await proposalModel.create(proposal)
    res.json(newProposals)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
  })
})
