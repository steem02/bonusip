const autoprefixer = require('autoprefixer');
	  mqpacker = require('css-mqpacker');
	  postcssShort = require('postcss-short');
	  font = require('postcss-font-magician');
	  assets = require('postcss-assets');
	  sprites = require('postcss-sprites');
	  scroll = require('postcss-momentum-scrolling');
	  doiuse = require('doiuse');
module.exports = ({env}) => ({
  map: false,
  plugins: [
  	autoprefixer(),
    env === 'production' ? assets({
    	loadPaths: ['dist/images/**'],
        relative: 'dist/css'
    }) : assets({
    	loadPaths: ['dist/images/**'],
    	relative: 'dist/css'
    }),
    postcssShort({ skip: '+' }),
    mqpacker({sort: true}),
    scroll(),
    font({
    	variants: {
    		'Roboto': {
    			'300': ['woff,woff2'],
    			'400 italic': ['woff2']
    		},
            'Muli': {
                '400': ['woff','woff2'],
                '700': ['woff','woff2']
            }
    	}
    }),
    // env === 'production' ? sprites({
    //     stylesheetPath: 'dist/css/',
    //     spritePath: 'dist/images/sprites',
    //   }) : false,
    env === 'production' ? false : doiuse({browsers: [
  		'last 2 version',
    	'> 5%',
    	'IE>11',
    	'IOS >=7']})
  	]
})