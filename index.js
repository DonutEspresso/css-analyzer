/* global module,require,process */

'use strict';

var fs  = require('fs'),

    counter = {
        getSelectorCount: function(line) {
            var selectorString,
                selectors;

            // even with @media queries, this still works

            // get the selector
            selectorString = line.trim().split('{')[0];
            // split selectors and get the length
            selectors = selectorString.split(',');

            return selectors ? selectors.length : 0;
        },

        getDeclarationCount: function(line) {
            var declarationString,
                declarations,
                i,
                count = 0;

            // get the rules
            // before: #test { background-color: blue;
            // after:  [ '#test ', 'background-color: blue;' ]            
            declarationString = line.trim().split('{')[1];
            // split rules and get the length:
            // before: background-color: blue;
            // after:  [ ' background-color: blue', '' ]
            if (declarationString) {
                declarations = declarationString.split(';');

                // check for any empty strings on split
                i = declarations.length;
                while (i--) {
                    if (declarations[i]) {
                        count++;
                    }
                }
            }

            return count;
        },

        getMediaQueryCount: function(line) {
            return (line.indexOf('@media') === -1) ? 0 : 1;
        },

        analyze: function(fileContents) {
            var blocks = 0,
                selectors = 0,
                declarations = 0,
                mediaQueries = 0;
                
            fileContents.split('}').forEach(function(line) {
                if (line) {
                    line += '}';
                    selectors += this.getSelectorCount(line);
                    declarations += this.getDeclarationCount(line);
                    mediaQueries += this.getMediaQueryCount(line);
                    blocks++;
                }
            }.bind(this));

            return {
                selectors: selectors,
                declarationBlocks: blocks,
                declarations: declarations,
                mediaQueries: mediaQueries
            };
        },

        analyzeFile: function(filepath, callback) {

            if (!filepath) {
                throw new Error('no file specified.');
            }
            if (!callback) {
                throw new Error('no callback passed in.');
            }

            fs.readFile(filepath, function(err, data) {
                if (err) { throw err; }
                callback(this.analyze(data.toString()));
            }.bind(this));
        }
    };

module.exports = counter;