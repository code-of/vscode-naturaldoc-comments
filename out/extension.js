'use strict';
var vscode = require('vscode');
var ndc = require('./ndcomment');

function activate(context) {
        var disposable = vscode.commands.registerCommand('extension.naturalDocComment', () => {
                var selection = vscode.window.activeTextEditor.selection;
                var startLine = selection.start.line - 1;
                var selectedText = vscode.window.activeTextEditor.document.getText(selection).toString();
                if (selectedText.length === 0) {
                        vscode.window.showInformationMessage('No text selected - Select a valid signature !');
                        return;
                }
                var ndcBuilder = new ndc.DocBuilder(selectedText);
                var comment = ndcBuilder.buildComment(selectedText);
                if (comment != null) {
                        vscode.window.activeTextEditor.edit((editBuilder) => {
                                var lastCharIndex = vscode.window.activeTextEditor.document.lineAt(startLine).text.length;
                                var pos;
                                if ((lastCharIndex > 0) && (startLine != 0)) {
                                        pos = new vscode.Position(startLine, lastCharIndex);
                                }
                                else {
                                        pos = new vscode.Position(startLine, 0);
                                }
                                editBuilder.insert(pos, comment);
                        }).then(function () {
                        });
                } else {
                        vscode.window.showInformationMessage('Failed to build comment for this selection !');
                }
        });

        context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {
        return;
}

exports.deactivate = deactivate;
