const port = process.env.port || 8000;
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app = express();

const newpapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }
]
const articles = [];
newpapers.forEach(newpaper => {
  axios.get(newpaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")',html).each(function(){
        articles.push({
            title: $(this).text(),
            url: newpaper.base + $(this).attr('href'),
            publisher: newpaper.name
        })
    })
  }).catch((err) => {
      
  });
})    

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

app.get('/', (req,res)=>{
    res.json('welcome to my-first-app');
})

app.get('/videos',async(req,res)=>{
    res.json(articles)
})

app.get('/videos/:papername',async(req,res)=>{
    res.json(articles.filter(article => article.publisher === req.params.papername ))
})