"use strict"

var shell = require('shelljs');
var path = require('path');
var colors = require('colors');


// The app
if(isGitRepository()){
	proceed();
}
else {
	shell.echo('This is not a Git repository.'.red);
	shell.exit(1);
}

function handleArguments() {
	let options = {
		path: './',
		editor: 'Visual Studio Code',
		branch: 'develop'
	}
	var properties = process.argv.splice(2);
	properties.forEach((arg, idx, arr) => {
		if (arg[0] === '-' && arr[idx+1]) {
			const next = idx + 1;
			switch(arg) {
				case '-p':
					options.path = arr[next];
					break;
				case '-e': 
					options.editor = arr[next];
					break;
				case '-b':
					options.branch = arr[next];
					break;
			}
		}  
	})
	return options;
}

function proceed() {
	let options = handleArguments();
	// Go to the directory
	if (options.path !== './') {
		shell.cd(options.path);
	}
	shell.echo('Comparaison avec la branche ' + options.branch);
	var ls = shell.exec( gitDiff(options.branch), {silent:true});
	if (!ls.length) {
		// No modified files found.
		shell.echo('Your branch is up-to-date compare to  '.yellow + options.branch.italic);
		shell.echo('No files will be openned'.yellow);
		openEditor(options.editor, './');
	}
	else {
		shell.echo('Ouverture des fichiers modifiés localement:'.cyan);
		shell.echo('Editeur: '.dim + options.editor .bold)
		// Remove all the displaying stuff from the string.
		var list = ls.stdout.replace(/\r?\n|\r/g, ' ').trim().split(' ');
		shell.echo('Fichiers:'.dim);
		// Open the all project in editor.
		openEditor(options.editor, './');

		list.forEach(function(filePath) {
		  // Open the needed files. (Don't need images and others ...)
		  if (['.html', '.js', '.json'].indexOf(path.extname(filePath)) > -1) {
		    shell.echo(filePath.green);
		    openEditor(options.editor, filePath)
		  }
		});
	}
	shell.echo('Happy coding, see you soon!'.cyan);
}

function gitDiff(branch) {
	return ("git diff --name-only " + branch);
}
// Functions 
function isGitRepository() {
	var ls = shell.exec('ls -d .* ', {silent:true});
	var dotFiles = ls.stdout.replace(/\r?\n|\r/g, ' ').trim().split(' ');
	return dotFiles.indexOf('.git') > -1;
}


function openEditor(editor, file) {
	shell.exec("open -a" + " '" + editor + "' " + file);
}
