//To save the latest url ID 
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  latest_id: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Counter', counterSchema);