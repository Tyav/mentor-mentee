let express = require('express')

let app = express(); 

app.use('/', (req, res) => {
  res.send('tested')
})

app.listen(6060, ()=> {
  console.log('sdsdfsdf')
})
