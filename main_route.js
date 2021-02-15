const router = require("express").Router();
const Url = require("./model_url");
const Counter = require("./model_counter");
const inputValidator = require("./middleware_validate_input");


router.post('/new', inputValidator, async (req, res) => {
  try {
    const {url} = req.body;
    let counter = await Counter.findOne();
    counter.latest_id = counter.latest_id + 1;

    //Check existing url first
    let urlDoc = await Url.findOne({original_url: url});
    if(urlDoc) {
      let responseObj = {original_url: urlDoc.original_url, short_url: urlDoc.short_url};
      return res.json(responseObj)
    }
    
    let newUrl = new Url({
      original_url: url,
      short_url: counter.latest_id
    })

    let savedUrl = await newUrl.save();
    
    //save latest counter
    await counter.save();
    
    if(savedUrl){
      let responseObj = {original_url: savedUrl.original_url, short_url: savedUrl.short_url };
      return res.json(responseObj);
    }
  }
  catch(err) {
    console.log(err.message);
    return res.json({error: err.message});
  }

})

router.get('/:id?', async (req, res)=> {
  try{
    const {id} = req.params;
    if(parseInt(id) == null)
      throw Error('Wrong format');
    
    let foundUrlDoc = await Url.findOne({short_url: id});
    if(foundUrlDoc)
      return res.redirect(foundUrlDoc.original_url);

    return res.json({error: "No short URL found for the given input"});
  }
  catch(err) {
    return res.json({'error': err.message});
  }
})



module.exports = router;
