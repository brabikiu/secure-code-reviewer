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
exports.noHardcodedSecretsRule = noHardcodedSecretsRule;
const vscode = __importStar(require("vscode"));
function noHardcodedSecretsRule(document) {
    const findings = [];
    const text = document.getText();
    const regex = /\b(api[_-]?key|token|secret|password)\b\s*[:=]\s*["'`][^"'`\n]{6,}["'`]/gi;
    let match;
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
//# sourceMappingURL=noHardcodedSecretsRule.js.map