const { model } = require('mongoose');
const { Schema } = require('mongoose');
const { HoldingSchema } = require('../schema/HoldingSchema');

const HoldingsModel = new model('holding', HoldingSchema);

module.exports = { HoldingsModel };


