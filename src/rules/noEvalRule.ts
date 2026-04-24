import * as vscode from 'vscode';
import { Finding } from '../types';

export function noEvalRule(document: vscode.TextDocument): Finding[] {
  const findings: Finding[] = [];
  const text = document.getText();
  const regex = /\beval\s*\(/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);

    findings.push({
      id: 'no-eval',
      title: 'Uso de eval',
      message: 'El uso de eval() puede introducir riesgos de seguridad y dificultar el mantenimiento.',
      severity: 'error',
      category: 'security',
      range: new vscode.Range(start, end),
      suggestion: 'Evita eval(). Usa parsing seguro, objetos, funciones explícitas o JSON.parse si aplica.'
    });
  }

  return findings;
}