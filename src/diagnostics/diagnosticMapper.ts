import * as vscode from 'vscode';
import { Finding } from '../types';

export function findingSeverityToDiagnosticSeverity(
  severity: Finding['severity']
): vscode.DiagnosticSeverity {
  switch (severity) {
    case 'error':
      return vscode.DiagnosticSeverity.Error;
    case 'warning':
      return vscode.DiagnosticSeverity.Warning;
    default:
      return vscode.DiagnosticSeverity.Information;
  }
}

export function mapFindingToDiagnostic(finding: Finding): vscode.Diagnostic {
  const diagnostic = new vscode.Diagnostic(
    finding.range,
    `[${finding.category}] ${finding.message}`,
    findingSeverityToDiagnosticSeverity(finding.severity)
  );

  diagnostic.source = 'secure-code-reviewer';
  diagnostic.code = finding.id;

  return diagnostic;
}