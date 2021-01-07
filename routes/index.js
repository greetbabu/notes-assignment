var express = require('express');
var router = express.Router();
var notesController = require('../controllers/notes.controller.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get a note
router.get('/notes/:userId', notesController.getANote);

// create a note
router.post('/notes/:userId', notesController.createANote);

module.exports = router;
