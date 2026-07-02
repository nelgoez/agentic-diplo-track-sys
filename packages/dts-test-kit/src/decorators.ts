import { randomUUID } from 'node:crypto';

interface AtcMetadata {
  testId: string
  label: string
}

const ATC_MAP = new Map<string, AtcMetadata>();

export function getAtcMap(): Map<string, AtcMetadata> {
  return ATC_MAP;
}

export function atc(testId: string) {
  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
  ) {
    const key = `${String(context.name)}-${randomUUID().slice(0, 8)}`;
    ATC_MAP.set(key, { testId, label: String(context.name) });

    function replacement(this: This, ...args: Args): Return {
      return target.call(this, ...args);
    }

    return replacement;
  };
}

export function step() {
  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
  ) {
    function replacement(this: This, ...args: Args): Return {
      return target.call(this, ...args);
    }

    return replacement;
  };
}
