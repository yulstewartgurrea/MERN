const { dbErrorHandler } = require('../helpers/dbErrorHandler');

const formidable = require('formidable');

const _ = require('lodash')

const fs = require('fs')

const Product = require('../models/product');

const { validationResult } = require('express-validator');


exports.getProduct = (req, res, next) => {
    const pid = req.params.pid;
    Product.findById(pid)
        .then(product => {
            if (!product) {
                return res.status(400).json({
                    error: "Product does not exist.",
                });
            }
            req.product = product
            return res.status(200).json({message: 'Success', data: product});
        })
        .catch(err => {
            return res.status(404).json({message: err});
        });
}


// Sort Product by sold = /products?sortBy=sold&order=desc&limit=4
// Sort Product by arrival = /products?sortBy=created&order=desc&limit=4

exports.getProducts = (req, res, next) => {
    let order = req.query.order ? req.query.order: "asc";
	let sortBy = req.query.sortBy ? req.query.sortBy: "_id";
	let limit = req.query.limit ? parseInt(req.query.limit): 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
		.limit(limit)
        .then(products => {
            if (!products) {
                return res.status(400).json({
                    error: "Unable to view products at the moment.",
                });
            }
            return res.status(200).json({message: 'Success', data: products, count: products.length});
        })
        .catch(err => {
            return res.status(404).json({message: err});
        });
}

exports.read = (req, res) => {
	req.product.photo = undefined
	return res.json(req.product);
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtenstions = true

    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                message: "Unable to upload image."
            })
        }

        // check all fields
        const { name, description, price, category, quantity, shipping } = fields

		if(!name || !description || !price || !category || !quantity || !shipping) {
			return res.status(400).json({
				error: "All input fields are required!"
			});
		}

        let product = new Product(fields)

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
              return res.status(400).json({
                error: "Image should be less than 1mb in size",
              });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
            product.photo.contentType = files.photo.mimetype; // change typt to mimetype
        }

        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    message: dbErrorHandler(err)
                })
            }
            return res.status(200).json({
                message: 'Success', data: result});
        })
    })

}

exports.updateProduct = (req, res, next) => {
    const pid = req.params.pid

    let form = new formidable.IncomingForm()
    form.keepExtenstions = true

    Product.findById(pid)
        .then(product => {
            if (!product) {
                return res.status(400).json({
                    error: "Product does not exist.",
                });
            }

            req.product = product
            
            form.parse(req, (err, fields, files) => {
                if(err) {
                    return res.status(400).json({
                        message: err
                    })
                }

                updated_product = _.extend(product, fields);
                console.log(updated_product)
        
                if (files.photo) {
                    if (files.photo.size > 1000000) {
                        return res.status(400).json({
                        error: "Photo should be less than 1mb in size",
                        });
                    }
                    updated_product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
                    updated_product.photo.contentType = files.photo.mimetype; // change typt to mimetype
                }
        
                updated_product.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            message: dbErrorHandler(err)
                        })
                    }
                    res.json(result);
                })
            })
        })
        .catch(err => {
            res.status(404).json({message: err});
        });
        
    
}

exports.getProductPhoto = (req, res, next) => {
    const pid = req.params.pid;
    Product.findById(pid)
        .then(product => {
            if (!product) {
                return res.status(400).json({
                    error: "Product does not exist.",
                });
            }
            res.set("Content-Type", product.photo.contentType);
		    return res.send(product.photo.data);
        })
        .catch(err => {
            return res.status(404).json({message: err});
        });
};

exports.deleteProduct = (req, res, next) => {
    const pid = req.params.pid;
    Product.findById(pid)
        .then(product => {
            if (!product) {
                return res.status(400).json({
                    error: "Product does not exist.",
                });
            }
            Product.findByIdAndRemove(pid)
            return res.status(200).json({message: 'Success'});
        })
        .catch(err => {
            res.status(404).json({message: err});
        });
}

/**
 * 
 * Get products by category 
 */
exports.getProductbyCategory = (req, res, next) => {
    let limit = req.query.limit ? parseInt(req.ruery.limit): 6;

	Product.find({
		_id: { $ne : req.product },
		category: req.product.category
	})
	.limit(limit)
	.populate("category", "_id name")
	.exec((err, products) => {
		if (err) {
			return res.status(400).json({
				error: "Products not found"
			});
		}
		res.json(products);
	});
}

// Get products categories
exports.getProductCategories = (req, res, next) => {
	Product.distinct("category", {}, (err, product) => {
        if (err) {
			return res.status(400).json({
				error: "Products not found"
			});
		}
		return res.json({message: "Success", data: products});
	});
}

exports.productSearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};