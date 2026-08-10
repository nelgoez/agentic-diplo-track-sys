import { existsSync, readFileSync, watch, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const API_COMPONENT_NAMES = [
  'AuthApi',
  'AdminApi',
  'TrackApi',
  'CourseApi',
  'StudentApi',
  'EnrollmentApi',
  'RuleApi',
  'CertificateApi',
];

const API_DIR = resolve(import.meta.dir, '..', 'tests', 'components', 'api');
const OUTPUT_PATH = resolve(import.meta.dir, '..', 'kata-manifest.json');
const ROOT_DIR = resolve(import.meta.dir, '..');

interface AtcMetadata {
  testId: string
  label: string
  story?: string
  feature?: string
}

interface ManifestAtc {
  testId: string
  method: string
  story: string
  feature: string
}

interface ManifestComponent {
  file: string
  atcs: ManifestAtc[]
}

interface Manifest {
  generated: string
  components: Record<string, ManifestComponent>
  totals: { components: number, atcs: number }
}

function parseMethodsFromSource(filePath: string): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const methods: string[] = [];
    const regex = /@atc\([^)]+\)\r?\n\s*async\s+(\w+)/g;
    let match = regex.exec(content);
    while (match !== null) {
      methods.push(match[1]);
      match = regex.exec(content);
    }
    return methods;
  }
  catch {
    return [];
  }
}

async function generateManifest(): Promise<Manifest> {
  const indexPath = resolve(API_DIR, 'index.ts');

  // Import all API components to trigger @atc() decorator registration
  await import(indexPath);

  const { getAllAtcs } = await import('@dts/test-kit');
  const allAtcs = getAllAtcs() as AtcMetadata[];

  // Build methodName → className map by scanning source files
  const methodClassMap = new Map<string, string>();
  for (const name of API_COMPONENT_NAMES) {
    const filePath = resolve(API_DIR, `${name}.ts`);
    const methods = parseMethodsFromSource(filePath);
    for (const methodName of methods) {
      methodClassMap.set(methodName, name);
    }
  }

  // Initialize all components (even empty ones)
  const components: Record<string, ManifestComponent> = {};
  for (const name of API_COMPONENT_NAMES) {
    components[name] = {
      file: `tests/components/api/${name}.ts`,
      atcs: [],
    };
  }

  let atcCount = 0;
  for (const atc of allAtcs) {
    const className = methodClassMap.get(atc.label);
    if (!className || !components[className]) { continue; }

    components[className].atcs.push({
      testId: atc.testId,
      method: atc.label,
      story: atc.story || '',
      feature: atc.feature || '',
    });
    atcCount++;
  }

  return {
    generated: new Date().toISOString(),
    components,
    totals: {
      components: API_COMPONENT_NAMES.length,
      atcs: atcCount,
    },
  };
}

function writeManifest(manifest: Manifest): void {
  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
}

function manifestUpToDate(manifest: Manifest): boolean {
  if (!existsSync(OUTPUT_PATH)) { return false; }
  try {
    const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8')) as Manifest;
    return (
      JSON.stringify(existing.components) === JSON.stringify(manifest.components)
      && existing.totals.components === manifest.totals.components
      && existing.totals.atcs === manifest.totals.atcs
    );
  }
  catch {
    return false;
  }
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    process.stdout.write([
      'Usage: bun scripts/kata-manifest.ts [flags]',
      '',
      'Flags:',
      '  --check   Exit 1 if manifest is stale, 0 if up-to-date',
      '  --watch   Watch for file changes and regenerate',
      '  --help    Show this help',
      '',
    ].join('\n'));
    return 0;
  }

  const checkMode = args.includes('--check');
  const watchMode = args.includes('--watch');

  try {
    const manifest = await generateManifest();

    if (checkMode) {
      if (manifestUpToDate(manifest)) {
        console.log('kata-manifest.json is up to date.');
        return 0;
      }
      console.log('kata-manifest.json is stale. Run `bun run kata:manifest` to regenerate.');
      return 1;
    }

    writeManifest(manifest);
    console.log(
      `kata-manifest.json written — ${manifest.totals.components} components, ${manifest.totals.atcs} ATCs`,
    );

    if (watchMode) {
      console.log('Watching for changes...');

      let debounce: ReturnType<typeof setTimeout> | null = null;
      const regenerate = () => {
        if (debounce) { clearTimeout(debounce); }
        debounce = setTimeout(() => {
          const result = Bun.spawnSync({
            cmd: ['bun', 'scripts/kata-manifest.ts'],
            cwd: ROOT_DIR,
            stdout: 'inherit',
            stderr: 'inherit',
          });
          if (result.exitCode !== 0) {
            console.error('Regeneration failed');
          }
        }, 200);
      };

      watch(API_DIR, { recursive: true }, (_event, filename) => {
        if (filename?.endsWith('.ts')) {
          console.log(`Change detected: ${filename}`);
          regenerate();
        }
      });

      // Keep process alive
      await new Promise(() => {});
    }

    return 0;
  }
  catch (err) {
    console.error('Error generating kata-manifest:', err);
    return 1;
  }
}

const exitCode = await main();
process.exit(exitCode);
