"use strict"

var shell = require('shelljs');
var path = require('path');
var colors = require('colors');

// The app
if(['--help', '-h'].indexOf(process.argv[2]) > -1) {
	showHelp();
}
else {
	var directoryPath = process.argv[2] || './';

	if(isGitRepository()){
		proceed();
	}
	else {
  	shell.echo('This is not a Git repository.'.red);
  	shell.exit(1);
	}
}

// Functions 
function isGitRepository() {
	if (directoryPath !== './') {
		shell.cd(directoryPath);
	}
	var ls = shell.exec('ls -d .* ', {silent:true});
	var dotFiles = ls.stdout.replace(/\r?\n|\r/g, ' ').trim().split(' ');
	return dotFiles.indexOf('.git') > -1;
}

function proceed() {
	var editor = process.argv[3] || 'code';
	var editorName = editor === 'code' ? 'VisualCode' : editor === 'st' ? 'SublimeText' : editor;
	shell.echo('Ouverture des fichiers modifiés localement:'.cyan);
	// var str = 'Editeur: ' + editorName;
	shell.echo('Editeur: '.dim + editorName .bold)
	shell.echo('Fichiers: '.dim);

	var ls = shell.exec('git diff --name-only develop', {silent:true});

	// Remove all the displaying stuff from the string.
	var list = ls.stdout.replace(/\r?\n|\r/g, ' ').trim().split(' ');

	// Open the all project in editor.
	openEditor(editor, directoryPath);

	list.forEach(function(filePath) {
	  // Open the needed files. (Don't need images and others ...)
	  if (['.html', '.js', '.json'].indexOf(path.extname(filePath)) > -1) {
	    shell.echo(filePath.green);
	    openEditor(editor, (directoryPath + filePath))
	  }
	});
	shell.echo('Happy coding, see you soon!'.cyan);
}

function showHelp() {
	shell.echo('How to use:'.magenta);
	shell.echo('open-rencent-file [directory_path] [editor]')
	shell.echo('directory_path abd editor are optional'.grey)
	shell.echo('Command to choose an Editor:'.magenta);
	var help = [
		'Visual code: open-recent-files code',
		'SublimeText: open-recent-files st',
	]
	help.forEach(function(phrase) {
		shell.echo(phrase.yellow);
	})
}

function openEditor(editor, file) {
	shell.exec(editor + ' ' + file);
}