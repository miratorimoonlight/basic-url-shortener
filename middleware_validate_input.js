const dns = require('dns');

const validator = (req, res, next) => {
  try{
    const {url} = req.body;
    const regexUrl = /^http(s?)?/
    
    if(!regexUrl.test(url)){
      console.log("Fail regex");
      return res.json({error: 'Invalid URL'});
    }
    
    //check if domain is valid or not
    const parsedUrl = new URL(url);
    dns.lookup(parsedUrl.host, (err, address, family)=> {
      if(err) return res.json({error: 'Invalid URL'});
      return next();           
    })
  }
  catch(err) {
    console.log(err.message)
    return res.json({error: 'Invalid URL'});
  }  
}


module.exports = validator;