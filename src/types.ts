import * as vscode from 'vscode';

export type FindingSeverity = 'info' | 'warning' | 'error';
export type FindingCategory = 'quality' | 'security';

export interface FindingFix {
  replacement: string;
}

export interface Finding {
  id: string;
  title: string;
  message: string;
  severity: FindingSeverity;
  category: FindingCategory;
  range: vscode.Range;
  suggestion?: string;
  fix?: FindingFix;
}