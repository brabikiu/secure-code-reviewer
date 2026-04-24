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
exports.noInnerHtmlRule = noInnerHtmlRule;
const vscode = __importStar(require("vscode"));
function noInnerHtmlRule(document) {
    const findings = [];
    const text = document.getText();
    const regex = /\.innerHTML\s*=/g;
    let match;
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
//# sourceMappingURL=noInnerHtmlRule.js.map