const express = require('express');
const router  = express.Router();
const Link = require('../models/link');

router.get('/:code/stats', async(req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({where: {
    code: code
  }});

  if(!resultado){
    res.sendStatus(404);
  }
  
  res.render('stats', resultado.dataValues);
});

router.get('/:code', async(req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({where: {
    code: code
  }});

  if(!resultado){
    res.sendStatus(404);
  }

  resultado.hits = resultado.hits +1;
  await resultado.save();

  res.redirect(resultado.url);
});

router.get('/', (req, res, next) => {
    res.render('index', { title: 'encurtador'} );
});

function generateCode()
{
    let text = '';
    let possible = 'ABCDEFGHIJLMNOPQRSTUVXZYW1234567890';
    for(let i=0; i < 5; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

router.post('/new', async (req, res, next) => {
    const url = req.body.url;
    const code = generateCode();

    const resultado = await Link.create({
      url,
      code
    });

 //   const result = 'http://localhost:3000/' + code;
    console.log(resultado.dataValues);
    res.render('stats', resultado.dataValues);

});

module.exports = router;