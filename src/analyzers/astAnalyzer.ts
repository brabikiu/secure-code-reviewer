import * as ts from 'typescript';
import * as vscode from 'vscode';
import { Finding } from '../types';

export function analyzeWithAST(document: vscode.TextDocument): Finding[] {
  const findings: Finding[] = [];

  const sourceFile = ts.createSourceFile(
    document.fileName,
    document.getText(),
    ts.ScriptTarget.Latest,
    true
  );
  const taintedVars = new Set<string>();

  function addFinding(
    node: ts.Node,
    id: string,
    title: string,
    message: string,
    severity: 'info' | 'warning' | 'error',
    suggestion: string
  ) {
    const start = document.positionAt(node.getStart(sourceFile));
    const end = document.positionAt(node.getEnd());

    findings.push({
      id,
      title,
      message,
      severity,
      category: 'security',
      range: new vscode.Range(start, end),
      suggestion
    });
  }

 function visit(node: ts.Node): void {

  // variables tainted 
  if (ts.isVariableDeclaration(node)) {
    if (node.initializer) {
      const initText = node.initializer.getText(sourceFile);

      const isUserInput =
        initText.includes('req.') ||
        initText.includes('request.') ||
        initText.includes('params') ||
        initText.includes('body') ||
        initText.includes('query');

      if (isUserInput && ts.isIdentifier(node.name)) {
        taintedVars.add(node.name.text);
      }
    }
  }

  //  eval
  if (ts.isCallExpression(node)) {
    if (ts.isIdentifier(node.expression) && node.expression.text === 'eval') {
      addFinding(
        node,
        'no-eval-ast',
        'Uso de eval',
        'Uso de eval detectado mediante AST.',
        'error',
        'Evita eval(). Usa alternativas seguras.'
      );
    }
  }

  //  console.log
  if (ts.isCallExpression(node)) {
    if (ts.isPropertyAccessExpression(node.expression)) {
      const objectName = node.expression.expression.getText(sourceFile);
      const methodName = node.expression.name.getText(sourceFile);

      if (objectName === 'console' && methodName === 'log') {
        addFinding(
          node,
          'console-log-ast',
          'Uso de console.log',
          'console.log puede dejar ruido en producción.',
          'info',
          'Usa un logger o elimina este log.'
        );
      }
    }
  }

  ts.forEachChild(node, visit);
}
  visit(sourceFile);

  return findings;
}