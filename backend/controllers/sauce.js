const Sauce = require('../models/sauce')







function addLike(res, sauceId, userId) {
  Sauce.updateOne(
      { _id: sauceId },
      {
          $inc: { likes: 1 },
          $push: { usersLiked: userId }
      }
  ).then(() => res.status(200).json({ message: 'Like updated!' })
  ).catch((error) => res.status(400).json({ error }));
};

function addDislike(res, sauceId, userId) {
  Sauce.updateOne(
      { _id: sauceId },
      {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId }
      }
  ).then(() => res.status(200).json({ message: 'Dislike updated!' })
  ).catch((error) => res.status(400).json({ error }));
};

function updateLikes(res, sauceId, userId) {
  Sauce.findById({ _id: sauceId })
      .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
              Sauce.updateOne(
                  { _id: sauceId },
                  {
                      $inc: { likes: -1 },
                      $pull: { usersLiked: userId }
                  }
              ).then(() => res.status(200).json({ message: 'updated!' })
              ).catch((error) => res.status(400).json({ error }));
          }

          if (sauce.usersDisliked.includes(userId)) {
              Sauce.updateOne(
                  { _id: sauceId },
                  {
                      $inc: { dislikes: -1 },
                      $pull: { usersDisliked: userId }
                  }
              ).then(() => res.status(200).json({ message: 'updated!' })
              ).catch((error) => res.status(400).json({ error }));
          }
      }).catch((error) => res.status(400).json({ error }));
};










exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(()=> res.status(201).json({message: 'Objet enrégistré'}))
    .catch( error =>res.status(400).json({error}));
  };

  
  exports.modifiySauce = (req, res, next)=>{
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce)=>{
        if(sauce.userId != req.auth.userId){
            res.status(401).json({message: 'Not authorized'})
        }else{
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(()=>res.status(200).json({message: 'object Modifié'}))
            .catch(error=> res.status(400).json({error}))
        }
    })
    .catch((error)=>{
        res.status(400).json({error});
    })

  };

  exports.deleteSauce = (req, res, next) =>{
    Sauce.deleteOne({_id: req.params.id})
    .then(()=>res.status(201).json({message: 'Objet supprimé'}))
    .catch(error=> res.status(400).json({error}))
  }


  exports.getAllaySauce = (req, res, next)=>{
    Sauce.find()
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
  };

  exports.getOneSauce = (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error=> res.status(404).json({error}));
  }



  exports.like = (req, res, next) => {
    const userId = req.body.userId;
    const sauceId = req.params.id;

    switch (req.body.like) {
        case 1:
            addLike(res, sauceId, userId);
            break;
        case -1:
            addDislike(res, sauceId, userId);
            break;
        case 0:
            updateLikes(res, sauceId, userId);
            break;
    }
};