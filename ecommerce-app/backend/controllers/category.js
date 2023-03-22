const Category = require('../models/category');

exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Success",
                post: result
            });
        }).catch(err => {
            console.log(err)
            res.status(404).json({
                error: err
            });
        });
}

exports.getCategory = (req, res) => {
    const cid = req.params.cid
    Category
        .findById(cid)
        .then(category => {
            console.log(category)
            return res.status(200).json({
                message: "Success",
                data: category
            });
        }).catch(err => {
            return res.status(404).json({
                error: err
            });
        });
}

exports.getCategories = (req, res) => {
    const category = new Category(req.body)
    Category
        .find()
        .then(categories => {
            return res.status(200).json({
                message: "Success",
                data: categories
            });
        }).catch(err => {
            return res.status(404).json({
                error: err
            });
        });
}

exports.updateCategory = (req, res, next) => {
    const cid = req.params.cid;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data incorrect."
        });
    }

    Category.findById(cid)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: "Category does not exists."
                });
            }
            category.name = req.body.name;
            category.description = req.body.name;
            category.save()
            return res.status(200).json({message: 'Success', data: category});
        })
        .catch(err => {
            return res.status(404).json({
                error: err
            });
        });
}

exports.deleteCategory = (req, res, next) => {
    const cid = req.params.cid;
    Category.findById(cid)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: "Category does not exists."
                });
            }
            Category.findByIdAndRemove(cid)
            return res.status(200).json({message: 'Success'});
        })
        .catch(err => {
            return res.status(404).json({
                error: err
            });
        });
}