import * as vscode from 'vscode';
import { Finding } from '../types';
import { noEvalRule } from '../rules/noEvalRule';
import { noInnerHtmlRule } from '../rules/noInnerHtmlRule';
import { noHardcodedSecretsRule } from '../rules/noHardcodedSecretsRule';

export function analyzeJsTsDocument(document: vscode.TextDocument): Finding[] {
  if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId)) {
    return [];
  }

  const findings: Finding[] = [];

  findings.push(...noEvalRule(document));
  findings.push(...noInnerHtmlRule(document));
  findings.push(...noHardcodedSecretsRule(document));

  return findings;
}