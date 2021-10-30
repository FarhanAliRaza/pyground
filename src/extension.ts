import * as vscode from "vscode";
import fs = require("fs");
import path = require("path");

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand(
    "pyground.helloWorld",
    () => {
      const wsedit = new vscode.WorkspaceEdit();
      if (vscode.workspace.workspaceFolders !== undefined) {
        const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; 
        const filePath = vscode.Uri.file(wsPath + "/pyground_temp/test.py");
        const x = wsedit.createFile(filePath, { ignoreIfExists: true });
        vscode.workspace.applyEdit(wsedit).then(() => {
          fs.writeFileSync(
            filePath.fsPath,
            "#Be warned files in pyground_temp folder will automatically delete when you will close this window",
            "utf8"
          );
          vscode.workspace.openTextDocument(filePath).then((doc) => {
            vscode.window.showTextDocument(doc);
          });
          vscode.window.showInformationMessage(
            "Created a new file: pyground_temp/test.py"
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (vscode.workspace.workspaceFolders !== undefined) {
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder

    fs.readdir(wsPath + "/pyground_temp", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(wsPath + "/pyground_temp", file), (err) => {
          if (err) throw err;
        });
      }
    });
  }
}
