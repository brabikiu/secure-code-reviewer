"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const jsTsAnalyzer_1 = require("./analyzers/jsTsAnalyzer");
const diagnosticMapper_1 = require("./diagnostics/diagnosticMapper");
const quickFixProvider_1 = require("./codeActions/quickFixProvider");
let diagnosticCollection;
function refreshDiagnostics(document) {
    const findings = (0, jsTsAnalyzer_1.analyzeJsTsDocument)(document);
    const diagnostics = findings.map(diagnosticMapper_1.mapFindingToDiagnostic);
    diagnosticCollection.set(document.uri, diagnostics);
}
function activate(context) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('secure-code-reviewer');
    context.subscriptions.push(diagnosticCollection);
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document);
    }
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(refreshDiagnostics), vscode.workspace.onDidSaveTextDocument(refreshDiagnostics), vscode.workspace.onDidChangeTextDocument((event) => {
        refreshDiagnostics(event.document);
    }), vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            refreshDiagnostics(editor.document);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('secureCodeReviewer.scanFile', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No hay ningún archivo abierto para analizar.');
            return;
        }
        refreshDiagnostics(editor.document);
        vscode.window.showInformationMessage('Análisis completado.');
    }));
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider(['javascript', 'typescript', 'javascriptreact', 'typescriptreact'], new quickFixProvider_1.QuickFixProvider(), {
        providedCodeActionKinds: quickFixProvider_1.QuickFixProvider.providedCodeActionKinds
    }));
}
function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
//# sourceMappingURL=config.ts.js.map