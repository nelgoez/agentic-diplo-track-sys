import { describe, expect, it } from 'bun:test';
import {
  isAntiPatternCitation,
  parseFrontmatter,
  stripFencedCodeBlocks,
} from '../../../scripts/lint-skills.ts';

describe('lint-skills — parseFrontmatter', () => {
  it('parses YAML frontmatter', () => {
    const raw = '---\ncomplementary_categories:\n  - testing\n---\n\nBody content here';
    const { meta, body } = parseFrontmatter(raw);
    expect(meta.complementary_categories).toEqual(['testing']);
    expect(body.trim()).toBe('Body content here');
  });

  it('returns empty meta when no frontmatter', () => {
    const { meta, body } = parseFrontmatter('just body');
    expect(meta).toEqual({});
    expect(body).toBe('just body');
  });

  it('handles empty frontmatter gracefully', () => {
    const raw = '---\n\n---\nbody';
    const { meta, body } = parseFrontmatter(raw);
    expect(meta).toEqual({});
    expect(body.trim()).toBe('body');
  });
});

describe('lint-skills — stripFencedCodeBlocks', () => {
  it('strips triple-backtick blocks', () => {
    const md = 'before\n```ts\ncode here\n```\nafter';
    expect(stripFencedCodeBlocks(md)).toBe('before\n\nafter');
  });

  it('passes through text without code blocks', () => {
    expect(stripFencedCodeBlocks('just text')).toBe('just text');
  });
});

describe('lint-skills — isAntiPatternCitation', () => {
  it('detects NEVER line', () => {
    expect(isAntiPatternCitation('NEVER hardcode credentials')).toBe(true);
  });

  it('detects Anti-pattern line', () => {
    expect(isAntiPatternCitation('Anti-pattern: using XPath')).toBe(true);
  });

  it('detects ❌ line', () => {
    expect(isAntiPatternCitation('❌ Do not use this')).toBe(true);
  });

  it('returns false for normal instruction', () => {
    expect(isAntiPatternCitation('Always use this pattern')).toBe(false);
  });
});
