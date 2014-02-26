/* global module,require,process */

'use strict';

var cssa = require('../index'),
    nomnom = require('nomnom'),
    args;

    args = nomnom
            .script('cssa')
            .options({
                file: {
                    position: 0,
                    help: 'Path to css file to analyze',
                    list: true
                }
            })
            .parse();

    if (args && args.hasOwnProperty('file') && args.file.length > 0) {
        cssa.analyzeFile(args.file[0], function(data) {
            var key;
            console.log('-----------------------------------------');
            console.log('file', ':', args.file[0]);
            for (key in data) {
                console.log(key, ':', data[key]);
            }
            if (data.selectors >= 4096) {
                console.log('You have over 4096 selectors. This file will not work properly in IE9.');
            }
            console.log('-----------------------------------------');
        });
    }