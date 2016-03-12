#!/usr/bin/env node

'use strict'

var minimist    = require('minimist')
  , luvi        = require('./luvi')
  , mix         = require('./util/mix')
  , each        = require('./util/each')
  , filter      = require('./util/filter')
  , readJSON    = require('./util/readJSON')
  , readFile    = require('./util/readFile')
  , isArrayLike = require('./util/isArrayLike')
  , pkg         = readJSON(__dirname, '..', 'package.json')
  , argv        = minimist(process.argv.slice(2))
  , log         = console.log
  , configFile  = argv.config || ('.' + pkg.name + '.json')
  , config      = argv.noconf ? null : readJSON(configFile)
  , servers     = isArrayLike(config) ? config : [config]

if(argv.v){argv.version = argv.v}
if(argv.h){argv.help    = argv.h}
if(argv.c){argv.config  = argv.c}
if(argv.r){argv.root    = argv.r}
if(argv.p){argv.port    = argv.p}
if(argv.n){argv.noconf  = argv.n}
if(argv.version){return log(pkg.version)}
if(argv.help){return log(readFile(__dirname, 'help.md'))}

if(argv._.length){
  servers = filter(servers, function(item){
    return item && argv._.indexOf(item.name) >= 0
  })
}

each(servers, function(server){
  luvi(mix(server, argv))
})

