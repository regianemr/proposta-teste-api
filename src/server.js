import dotenv from 'dotenv';
import express from 'express';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import connectDB from './config/database.js';
import checkIdempotency from './middlewares/middleware.js';
import auditModel from './models/audit.js';
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

app.post("/proposals", checkIdempotency, async (req, res) => {
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

app.patch("/proposals/:id", async (req, res) => {
  try {
    const id = req.params.id
    const proposal = await proposalModel.findOne({id})
    const version = proposal.version
    const updated = _.pickBy(req.body, (v, k) => ['product','monthly_amount','origin'].includes(k))
    const result = await proposalModel.findOneAndUpdate(
      {id, version},
      {
        $set: updated,
        $inc: {version: 1}
      },
      {
        new: true
      }
    )
    res.json(result)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})

app.post("/proposals/:proposal_id/:status", async (req, res) => {
  try {
    console.log(req.params)
    const proposal_id = req.params.proposal_id
    const newStatus = req.params.status
    const finalStatus = ['APPROVED', 'REJECTED', 'CANCELED']
    const proposal = await proposalModel.findOne({id: proposal_id})
    if (finalStatus.includes(proposal.status)) {
      return res.status(400).json({ message: 'O status final não pode ser alterado!'})
    }
    const audit = {
      id: nanoid(),
      proposal_id,
      actor: "system",
      event: 'STATUS_CHANGED',
      payload: JSON.stringify({oldStatus: proposal.status, newStatus})
    }
    await auditModel.create(audit)
    proposal.status = newStatus
    proposal.save()
    console.log(proposal)
    res.json(proposal)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})

app.get("/proposals/:id", async (req, res) => {
  try {
    const id = req.params.id
    const proposals = await proposalModel.find({id})
    console.log(proposals)
    res.json(proposals)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})

app.get("/proposals", async (req, res) => {
  try {
    const proposal = req.body
    const proposals = await proposalModel.find(proposal)
    console.log(proposals)
    res.json(proposals)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})

app.get("/proposals/:id/audit", async (req, res) => {
  try {
    console.log(req.params)
    const id = req.params.id
    const proposals = await auditModel.find({proposal_id: id})
    console.log("asfasfaf", proposals)
    res.json(proposals)
  } catch (error) {
    console.log('error', error);
    res.json({error})
  }
})
// Exclusão lógica
app.delete("/proposals/:id", async(req, res) => {
  try {
    const id = req.params.id
    await proposalModel.updateOne(
      {id},
      {
        $set: {deleted_at: new Date()}
      }
    )
    res.status(204).json({message: 'Deletado!'})
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
