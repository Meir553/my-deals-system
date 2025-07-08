// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const ogs = require('open-graph-scraper');
const app = express();
const DATA = './deals.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

async function readDeals() { return fs.readJson(DATA).catch(() => []); }
async function writeDeals(deals) { return fs.writeJson(DATA, deals, { spaces: 2 }); }

app.get('/api/deals', async (req, res) => {
  const deals = await readDeals();
  res.json(deals);
});

app.get('/api/deals/:id', async (req, res) => {
  const deals = await readDeals();
  const deal = deals.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Not found' });
  res.json(deal);
});

app.post('/api/deals', async (req, res) => {
  const deals = await readDeals();
  const id = Date.now().toString();
  let { title, image, originalPrice, dealPrice, description, link, notes, expired } = req.body;
  if (link && (!title || !image)) {
    try {
      const { result } = await ogs({ url: link });
      title       = title       || result.ogTitle;
      image       = image       || result.ogImage?.url;
      description = description || result.ogDescription;
    } catch(e) { /* ignore */ }
  }
  const deal = { id, title, image, originalPrice, dealPrice, description, link, notes, expired: !!expired };
  deals.push(deal);
  await writeDeals(deals);
  res.status(201).json(deal);
});

app.put('/api/deals/:id', async (req, res) => {
  const deals = await readDeals();
  const idx = deals.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error:'Not found' });
  deals[idx] = { ...deals[idx], ...req.body };
  await writeDeals(deals);
  res.json(deals[idx]);
});

app.delete('/api/deals/:id', async (req, res) => {
  let deals = await readDeals();
  deals = deals.filter(d => d.id !== req.params.id);
  await writeDeals(deals);
  res.json({ deleted: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port', process.env.PORT || 3000);
});
