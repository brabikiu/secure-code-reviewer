"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeJsTsDocument = analyzeJsTsDocument;
const noEvalRule_1 = require("../rules/noEvalRule");
const noInnerHtmlRule_1 = require("../rules/noInnerHtmlRule");
const noHardcodedSecretsRule_1 = require("../rules/noHardcodedSecretsRule");
function analyzeJsTsDocument(document) {
    if (!['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId)) {
        return [];
    }
    const findings = [];
    findings.push(...(0, noEvalRule_1.noEvalRule)(document));
    findings.push(...(0, noInnerHtmlRule_1.noInnerHtmlRule)(document));
    findings.push(...(0, noHardcodedSecretsRule_1.noHardcodedSecretsRule)(document));
    return findings;
}
//# sourceMappingURL=jsTsAnalyzer.js.map