'use strict';

require('dotenv').load();

var Meeseeks = require('meeseeks');
var meeseeks = new Meeseeks({
  name: 'product-catalog-service',
  jwtSigningToken: process.env.JWT_SIGNING_KEY,
});

var CATEGORIES = require('./data/categories.json');
var PRODUCTS = require('./data/products.json');

meeseeks.define('parent-categories', function(context, callback) {
  callback(null, CATEGORIES.filter(function(category) {
    return category.parentCategory === null;
  }));
});

meeseeks.define('child-categories', function(context, callback) {
  var parentCategoryId = context.body.parentCategoryId;
  callback(null, CATEGORIES.filter(function(category) {
    return category.parentCategory === parentCategoryId;
  }));
});

meeseeks.define('list-products', function(context, callback) {
  var parentCategoryId = context.body.parentCategoryId;
  callback(null, PRODUCTS.filter(function(product) {
    return product.categories.indexOf(parentCategoryId) > -1;
  }));
});

module.exports.handler = meeseeks.handler;
