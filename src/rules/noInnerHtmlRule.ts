import * as vscode from 'vscode';
import { Finding } from '../types';

export function noInnerHtmlRule(document: vscode.TextDocument): Finding[] {
  const findings: Finding[] = [];
  const text = document.getText();

  const regex = /\.innerHTML\s*=/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);

    findings.push({
      id: 'no-innerhtml',
      title: 'Uso de innerHTML',
      message: 'Asignar directamente a innerHTML puede abrir la puerta a XSS si el contenido no está sanitizado.',
      severity: 'warning',
      category: 'security',
      range: new vscode.Range(start, end),
      suggestion: 'Prefiere textContent o sanitiza explícitamente el HTML antes de insertarlo.'
    });
  }

  return findings;
}