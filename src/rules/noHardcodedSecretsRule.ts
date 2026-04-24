import * as vscode from 'vscode';
import { Finding } from '../types';

export function noHardcodedSecretsRule(document: vscode.TextDocument): Finding[] {
  const findings: Finding[] = [];
  const text = document.getText();

  const regex =
    /\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*["'`][^"'`\n]{6,}["'`]/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);

    findings.push({
      id: 'no-hardcoded-secrets',
      title: 'Posible secreto hardcodeado',
      message: 'Se detectó un posible secreto embebido en el código.',
      severity: 'error',
      category: 'security',
      range: new vscode.Range(start, end),
      suggestion: 'Mueve este valor a variables de entorno o a un gestor de secretos.'
    });
  }

  return findings;
}