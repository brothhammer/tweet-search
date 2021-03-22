const express = require('express')
const router = express.Router()
const TWITTER_API_TOKEN = process.env.TWITTER_API_TOKEN
const axios = require('axios');

router.post('/search', async function (req, res) {
  const { query } = req.body
  const url = `https://api.twitter.com/1.1/search/tweets.json?${query}`

  const result = await axios.get(url, { headers: { Authorization: `Bearer ${TWITTER_API_TOKEN}` } })
    .then((response) => { return response.data })

  return res.status(200).send(result)
})

module.exports = router
