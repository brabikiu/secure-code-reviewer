"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExcludedPath = isExcludedPath;
function isExcludedPath(fsPath, excludedFolders) {
    const normalized = fsPath.replace(/\\/g, '/').toLowerCase();
    return excludedFolders.some(folder => {
        const f = folder.toLowerCase().replace(/\\/g, '/');
        return normalized.includes(`/${f}/`) || normalized.endsWith(`/${f}`);
    });
}
//# sourceMappingURL=pathUtils.js.map