export function isExcludedPath(fsPath: string, excludedFolders: string[]): boolean {
  const normalized = fsPath.replace(/\\/g, '/').toLowerCase();

  return excludedFolders.some(folder => {
    const f = folder.toLowerCase().replace(/\\/g, '/');
    return normalized.includes(`/${f}/`) || normalized.endsWith(`/${f}`);
  });
}