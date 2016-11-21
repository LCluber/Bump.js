var express = require('express');
var router = express.Router();

router.get('/:page', function(req, res) {
  var prms = req.params;
  //console.log(prms);
  res.render(prms.page, {

  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    
  });
});

module.exports = router;
