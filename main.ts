// PALMHEIST Cover Studio — the entrypoint (Node 22, standard library only).
// Hands the app in: it copies app/ and screenshots/ from this repository
// into the output directory and writes the dossier there. The output
// directory itself is never removed: the grader runs this program as a user
// who cannot delete that directory, so deleting it would fail the run.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// Both inputs must be present in the repository, or there is nothing to hand in.
for (const name of ['app', 'screenshots']) {
  if (!existsSync(join(repoDir, name))) {
    throw new Error(`PALMHEIST: ${name}/ is missing from the repository`);
  }
}

// Create the output directory (and any missing parents) when it is not there.
mkdirSync(outDir, { recursive: true });

// Copy the app and its screenshots in. Files already there are overwritten;
// nothing is ever deleted, and the output directory itself is never removed.
cpSync(join(repoDir, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(repoDir, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

// The dossier the scorer compares byte for byte.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

console.log(`PALMHEIST handed in to ${outDir}`);
