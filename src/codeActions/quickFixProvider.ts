import * as vscode from 'vscode';

export class QuickFixProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.code === 'no-innerhtml') {
        const action = new vscode.CodeAction(
          'Reemplazar innerHTML por textContent',
          vscode.CodeActionKind.QuickFix
        );

        action.edit = new vscode.WorkspaceEdit();

        const lineText = document.lineAt(range.start.line).text;
        const updated = lineText.replace('.innerHTML =', '.textContent =');

        action.edit.replace(
          document.uri,
          document.lineAt(range.start.line).range,
          updated
        );

        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        actions.push(action);
      }
    }

    return actions;
  }
}