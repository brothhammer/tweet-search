const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const TOKEN = process.env.TWITTER_API_TOKEN

console.log(TOKEN);

router.post('/search', async function (req, res) {
  const { query } = req.body
  const url = `https://api.twitter.com/1.1/search/tweets.json?${query}`
  const headers = { headers: { Authorization: `Bearer ${TOKEN}` } }

  const result = await fetch(url, headers).then((response) => response.json())

  return res.status(200).send(result)
})

module.exports = router
