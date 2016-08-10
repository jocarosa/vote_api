'use strict';

module.exports = {
	'githubAuth': {
		'clientID'		: process.env.GITHUB_KEY,
		'clientSecret'	: process.env.GITHUB_SECRET,
		'callbackURL'	: process.env.APP_URL + 'auth/github/callback'
	}, 
	'twitterAuth' : {
        'clientID'      : 'BqGBhMaUsdH5bwOQ1kR3DEY4Z',
        'clientSecret'  : 'u19cDASxWAk8jc5Zh3epXumbZ79gvgamLxGHKZ5TNfHQ2mv5Pv',
        'callbackURL'   : '/auth/twitter/callback'
    }
};
