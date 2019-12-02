const models = require('../models');

module.exports = {
    get: (req, res, next) => {
        const limitCondition = +req.query.limit;

        if(limitCondition) {
            models.Origami.find().populate('author').sort({_id: -1}).limit(limitCondition)
            .then((origamies) => res.send(origamies))
            .catch(next);

            return;
        } 

        models.Origami.find().populate('author')
        .then((origamies) => res.send(origamies))
        .catch(next);
    },

    post: (req, res, next) => {
        const { description } = req.body;
        const { _id } = req.user;

        models.Origami.create({ description, author: _id })
            .then((createdOrigami) => {
                return Promise.all([
                    models.User.updateOne({ _id }, { $push: { posts: createdOrigami } }),
                    models.Origami.findOne({ _id: createdOrigami._id })
                ]);
            })
            .then(([modifiedObj, origamiObj]) => {
                res.send(origamiObj);
            })
            .catch(next);
    },

    put: (req, res, next) => {
        const id = req.params.id;
        const { description } = req.body;
        models.Origami.updateOne({ _id: id }, { description })
            .then((updatedOrigami) => res.send(updatedOrigami))
            .catch(next)
    },

    delete: (req, res, next) => {
        const id = req.params.id;
        models.Origami.deleteOne({ _id: id })
            .then((removedOrigami) => res.send(removedOrigami))
            .catch(next)
    }
};