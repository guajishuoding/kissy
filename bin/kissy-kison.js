#!/usr/bin/env node

/**
 * Generate parser function using LALR algorithm.
 * @author yiminghe@gmail.com
 */
var program = require('../tools/commander/');
program
    .option('-g, --grammar <grammar>', 'Set kison grammar file')
    .option('-p, --path <path>', 'Set generated file path')
    .option('-e, --encoding [encoding]', 'Set grammar file encoding', 'utf-8')
    .option('-m, --module [module]', 'Set generated kissy module name', '')
    .option('-w, --watch', 'Watch grammar file change')
    // defaults bool true
    .option('--no-compressSymbol', 'Set compress symbol', true)
    .option('--compressLexerState', 'Set compress lexer state')
    .parse(process.argv);

var S = require('../build/kissy-nodejs'),
    js_beautify = require('js-beautify').js_beautify,
    fs = require('fs'),
    m_path = program.path,
    path = require('path'),
    grammar = path.resolve(program.grammar),
    encoding = program.encoding;

var kisonCfg = {
    compressLexerState: program.compressLexerState,
    compressSymbol: program.compressSymbol
};

console.log(kisonCfg)

// S.log('*********** grammar:');
// S.log(grammar);

var grammarBaseName = path.basename(grammar, '-grammar.kison');

// S.log('*********** grammarBaseName:');
// S.log(grammarBaseName);

var modulePath;

if (m_path) {
    // S.log('*********** m_path:');
    m_path = path.resolve(m_path) + '/';
    modulePath = m_path + grammarBaseName + '.js';
} else {
    modulePath = path.resolve(grammar, '../' + grammarBaseName + '.js');
}

// S.log('*********** modulePath:');
// S.log(modulePath);

var codeTemplate = '' +
    '/*\n' +
    '  Generated by kissy-kison.' +
    '*/\n' +
    'KISSY.add({module} function(){\n' +
    '{code}\n' +
    '});';

var module = program.module;

if (module) {
    module = '"' + module + '",';
}

function my_js_beautify(str) {
    //return str;
    var opts = {"indent_size": "4", "indent_char": " ",
        "preserve_newlines": true, "brace_style": "collapse",
        "keep_array_indentation": false, "space_after_anon_function": true};
    return js_beautify(str, opts);
}


S.use('kison', function (S, KISON) {

    function genParser() {

        var grammarContent = fs.readFileSync(grammar, encoding);
        //// S.log('*********** grammarContent:');
        //// S.log(grammarContent);

        console.info('start generate grammar module: ' + modulePath + '\n');
        var start = S.now();

        var code = new KISON.Grammar(eval(grammarContent)).genCode(kisonCfg);

        var moduleCode = my_js_beautify(S.substitute(codeTemplate, {
            module: module,
            code: code
        }));

        //// S.log(moduleCode);

        fs.writeFileSync(modulePath, moduleCode, encoding);

        console.info('generate grammar module: ' + modulePath + ' at ' + (new Date().toLocaleString()));
        console.info('duration: ' + (S.now() - start) + 'ms');

    }

    var bufferCompile = S.buffer(genParser);

    if (program.watch) {
        fs.watch(grammar, bufferCompile);
        genParser();
    } else {
        bufferCompile();
    }

});