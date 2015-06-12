'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	User = require('mongoose').model('User'),
	Settingempresa = require('mongoose').model('Settingempresa'),
	path = require('path'),
	config = require('./config');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({_id: id}, '-salt -password').populate('settingempresa').exec(function (err, docs) {
			var options = {
		      path: 'settingempresa.condicioniva',
		      model: 'Condicioniva'
		    };

		    //if (err) return res.json(500);
		    User.populate(docs, options, function (err, user) {
		      done(err, user);//console.log(projects);
		    });
		});
	});


/*
BlogPost.find({ tags: 'fun' }).lean().populate('author').exec(function (err, docs) {
        assert.ifError(err);
 
        var opts = {
            path: 'author.friends'
          , select: 'name'
          , options: { limit: 2 }
        }
 
        BlogPost.populate(docs, opts, function (err, docs) {
          assert.ifError(err);
          console.log();
          console.log(docs);
          done();
        })
      })
*/
	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};