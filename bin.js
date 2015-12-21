#!/usr/bin/env node

function usage () {/*

    Usage
        whoareyou [gh username]

    Options
         -v             verbose
         -h             show help

    Examples
        whoareyou -v -h
        whoareyou -v -- maboiteaspam
 */}

var argv  = require('minimist')(process.argv.slice(2));
var debug = require('@maboiteaspam/set-verbosity')('whoareyou', process.argv);
var pkg   = require('./package.json')
var help  = require('@maboiteaspam/show-help')(usage, process.argv, pkg);

(!argv['_'] || !argv['_'].length) && help.print(usage, pkg) && help.die();

debug('%j', argv)

var url     = require('url')
var https   = require('https')

var username    = argv['_'][0].replace(/[^a-z0-9-_ ]+/, '');
var README      = 'https://raw.githubusercontent.com/' + username + '/whoami/master/README.md'

debug('%s', username)
debug('%s', README)

var options = url.parse(README);
debug('%j', options)

options.protocol = 'https:'
options.port = 443

var req = https.request(options, function(res) {
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        data += chunk + '';
    });
    res.on('end', function() {
        var marked = require('marked');
        var TerminalRenderer = require('marked-terminal');
        var renderer = new TerminalRenderer({});
        marked.setOptions({
            renderer: renderer
        });
        console.log(marked(data))
    })
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    console.log('Probably one of,');
    console.log('this user does not have whoami repository README');
    console.log('their are connectivity issues');
    console.log('there s a typo in: ' + username);
});

req.end();
