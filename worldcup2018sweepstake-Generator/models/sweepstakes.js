var mongoose = require('mongoose');
var SweepSchema = new mongoose.Schema({
  name: String,
  creator: {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String
  },
  players: [{name: String, team: [String], flag: [String]}]
});

module.exports = mongoose.model('Sweepstake', SweepSchema);