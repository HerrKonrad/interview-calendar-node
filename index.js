const express = require('express')
const bodyParser = require('body-parser');
const { assertTypeParameter } = require('@babel/types');


const app = express()
const PORT = process.env.PORT || 4000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Obtenção de todas os rotas
require("./routes/candidate.route")(app)
require("./routes/interviewer.route")(app)
require("./routes/availability.route")(app)


app.listen(PORT, () => {
    console.log(`O ambiente está definido como: ${process.env.NODE_ENV}`)
    console.log(`API escutando na porta: ${PORT} `)
  })
  
  app.get('/', (req, res) => {
    res.send('Atenção, os endpoints desta api estão em /api/, por exemplo /api/clientes')
  })

  module.exports = app