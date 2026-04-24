import * as vscode from 'vscode';
import { analyzeJsTsDocument } from './analyzers/jsTsAnalyzer';
import { mapFindingToDiagnostic } from './diagnostics/diagnosticMapper';
import { QuickFixProvider } from './codeActions/quickFixProvider';

let diagnosticCollection: vscode.DiagnosticCollection;

function refreshDiagnostics(document: vscode.TextDocument): void {
  const findings = analyzeJsTsDocument(document);
  const diagnostics = findings.map(mapFindingToDiagnostic);
  diagnosticCollection.set(document.uri, diagnostics);
}

export function activate(context: vscode.ExtensionContext): void {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('secure-code-reviewer');
  context.subscriptions.push(diagnosticCollection);

  if (vscode.window.activeTextEditor) {
    refreshDiagnostics(vscode.window.activeTextEditor.document);
  }

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(refreshDiagnostics),
    vscode.workspace.onDidSaveTextDocument(refreshDiagnostics),
    vscode.workspace.onDidChangeTextDocument((event) => {
      refreshDiagnostics(event.document);
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        refreshDiagnostics(editor.document);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('secureCodeReviewer.scanFile', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('No hay ningún archivo abierto para analizar.');
        return;
      }

      refreshDiagnostics(editor.document);
      vscode.window.showInformationMessage('Análisis completado.');
    })
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'],
      new QuickFixProvider(),
      {
        providedCodeActionKinds: QuickFixProvider.providedCodeActionKinds
      }
    )
  );
}

export function deactivate(): void {
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
}