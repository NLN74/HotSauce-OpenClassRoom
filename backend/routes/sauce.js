const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauce');

router.post('/', auth, multer, stuffCtrl.createSauce);
  
  router.get('/', auth, stuffCtrl.getAllaySauce);
  
  router.get('/:id', auth, stuffCtrl.getOneSauce);

  router.put('/:id', auth, multer, stuffCtrl.modifiySauce);

  router.delete('/:id', auth, stuffCtrl.deleteSauce);

  router.post('/:id/like', auth,  stuffCtrl.like);

  router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  module.exports = router;