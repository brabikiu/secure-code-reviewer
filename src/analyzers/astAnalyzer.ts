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

  
  // innerHTML
  if (ts.isBinaryExpression(node)) {
    const isAssign = node.operatorToken.kind === ts.SyntaxKind.EqualsToken;

    if (isAssign && ts.isPropertyAccessExpression(node.left)) {
      if (node.left.name.text === 'innerHTML') {
        addFinding(
          node,
          'innerhtml-ast',
          'Asignación a innerHTML',
          'Uso potencialmente inseguro de innerHTML.',
          'warning',
          'Usa textContent o sanitiza.'
        );
      }
    }
  }

  // SQL injection con taint
  if (ts.isBinaryExpression(node)) {
    const isConcat = node.operatorToken.kind === ts.SyntaxKind.PlusToken;

    if (isConcat) {
      const leftText = node.left.getText(sourceFile).toLowerCase();
      const rightText = node.right.getText(sourceFile).toLowerCase();

      const fullText = `${leftText} ${rightText}`;

      const looksLikeSql =
        fullText.includes('select ') ||
        fullText.includes('insert ') ||
        fullText.includes('update ') ||
        fullText.includes('delete ') ||
        fullText.includes('where ');

      let usesTainted = false;

      if (ts.isIdentifier(node.left)) {
        usesTainted = taintedVars.has(node.left.text);
      }

      if (ts.isIdentifier(node.right)) {
        usesTainted = taintedVars.has(node.right.text);
      }

      if (looksLikeSql && usesTainted) {
        addFinding(
          node,
          'sql-injection-ast',
          'SQL Injection detectado',
          'Variable de usuario usada en SQL.',
          'error',
          'Usa queries parametrizadas.'
        );
      }
    }
  }

  // SQL Injection con template string
if (ts.isTemplateExpression(node)) {
  const text = node.getText(sourceFile).toLowerCase();

  const looksLikeSql =
    text.includes('select ') ||
    text.includes('insert ') ||
    text.includes('update ') ||
    text.includes('delete ') ||
    text.includes('where ');

  let usesTainted = false;

  for (const span of node.templateSpans) {
    const expr = span.expression;

    if (ts.isIdentifier(expr) && taintedVars.has(expr.text)) {
      usesTainted = true;
    }
  }

  if (looksLikeSql && usesTainted) {
    addFinding(
      node,
      'sql-template-injection-ast',
      'SQL Injection con template string',
      'Variable de usuario usada en SQL mediante template string.',
      'error',
      'Usa queries parametrizadas en lugar de interpolar valores directamente.'
    );
  }
}

if (ts.isVariableDeclaration(node) && node.initializer && ts.isIdentifier(node.name)) {
  const varName = node.name.text;

  if (ts.isIdentifier(node.initializer)) {
    const from = node.initializer.text;
    if (taintedVars.has(from)) {
      taintedVars.add(varName);
    }
  }
}

  ts.forEachChild(node, visit);
}
  visit(sourceFile);

  return findings;
}