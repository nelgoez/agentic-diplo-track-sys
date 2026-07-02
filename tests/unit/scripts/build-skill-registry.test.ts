import { describe, expect, it } from 'bun:test';
import {
  bulletText,
  distillPurpose,
  extractStrategyA,
  renderEntry,
  splitFrontmatter,
  stripVolatile,
} from '../../../scripts/build-skill-registry.ts';

describe('build-skill-registry — splitFrontmatter', () => {
  it('splits YAML frontmatter from body', () => {
    const { frontmatter, body } = splitFrontmatter('---\nname: test\n---\n\nbody text');
    expect(frontmatter).toEqual({ name: 'test' });
    expect(body.trim()).toBe('body text');
  });

  it('returns empty frontmatter when no frontmatter', () => {
    const { frontmatter, body } = splitFrontmatter('just text');
    expect(frontmatter).toEqual({});
    expect(body).toBe('just text');
  });

  it('handles incomplete frontmatter', () => {
    const { frontmatter, body } = splitFrontmatter('---\nname: test\nno close');
    expect(frontmatter).toEqual({});
    expect(body).toBe('---\nname: test\nno close');
  });
});

describe('build-skill-registry — bulletText', () => {
  it('extracts from dash bullet', () => {
    expect(bulletText('- hello world')).toBe('hello world');
  });

  it('extracts from star bullet', () => {
    expect(bulletText('* hello world')).toBe('hello world');
  });

  it('extracts from numbered bullet', () => {
    expect(bulletText('1. first item')).toBe('first item');
  });

  it('extracts from indented bullet', () => {
    expect(bulletText('  - indented')).toBe('indented');
  });

  it('returns null for non-bullet', () => {
    expect(bulletText('plain text')).toBeNull();
  });
});

describe('build-skill-registry — extractStrategyA', () => {
  it('extracts from ## Compact Rules section', () => {
    const body = '# Title\n## Compact Rules\n- rule one\n- rule two\n## Other';
    const result = extractStrategyA(body);
    expect(result).not.toBeNull();
    expect(result!.rules).toEqual(['rule one', 'rule two']);
    expect(result!.truncated).toBe(false);
  });

  it('extracts from ## Standards section', () => {
    const body = '## Standards\n- first rule\n- second rule';
    const result = extractStrategyA(body);
    expect(result).not.toBeNull();
    expect(result!.rules).toEqual(['first rule', 'second rule']);
  });

  it('returns null when no rules section found', () => {
    expect(extractStrategyA('# Just a title')).toBeNull();
  });
});

describe('build-skill-registry — distillPurpose', () => {
  it('truncates to first sentence', () => {
    expect(distillPurpose('First sentence. Second sentence.')).toBe('First sentence.');
  });

  it('returns fallback string for undefined', () => {
    expect(distillPurpose(undefined)).toBe('(no description in frontmatter)');
  });
});

describe('build-skill-registry — stripVolatile', () => {
  it('replaces Generated timestamp with stripped marker', () => {
    const text = '# Header\n> Generated: `2026-06-30T12:00:00.000Z`\nFooter';
    expect(stripVolatile(text)).toBe('# Header\n> Generated: `<stripped>`\nFooter');
  });

  it('passes through text without Generated line', () => {
    expect(stripVolatile('just text')).toBe('just text');
  });
});

describe('build-skill-registry — renderEntry', () => {
  it('renders a skill entry', () => {
    const entry = {
      name: 'test-skill',
      slug: 'test-skill',
      path: '.claude/skills/test-skill/SKILL.md',
      purpose: 'Test purpose.',
      frontmatter: { phase: 'dev', scope: 'testing' },
      readFullWhen: 'when debugging tests',
      rules: ['rule one', 'rule two'],
      strategy: 'A' as const,
      truncated: false,
    };
    const result = renderEntry(entry);
    expect(result).toContain('test-skill');
    expect(result).toContain('Test purpose.');
    expect(result).toContain('rule one');
    expect(result).toContain('rule two');
  });
});
