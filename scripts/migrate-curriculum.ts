#!/usr/bin/env npx tsx
/**
 * Curriculum Migration Script
 *
 * Transforms curriculum markdown files into Astro content collection slides.
 *
 * Usage:
 *   npx tsx scripts/migrate-curriculum.ts curriculum/01-concepts site/src/content/slides/01-concepts
 *   npx tsx scripts/migrate-curriculum.ts --all  # Migrate all parts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface SlideMetadata {
  title: string;
  part: number;
  order: number;
  layout?: 'title' | 'content' | 'split' | 'code' | 'quote';
  notes?: string;
  sourceFile?: string;
}

interface ParsedCurriculum {
  frontmatter: Record<string, string>;
  timeNote?: string;
  slides: { content: string; suggestedTitle: string }[];
}

/**
 * Parse frontmatter from markdown content.
 * Returns the frontmatter object and the remaining body.
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const lines = content.split('\n');

  // Check if file starts with frontmatter delimiter
  if (lines[0]?.trim() !== '---') {
    return { frontmatter: {}, body: content };
  }

  // Find closing delimiter
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { frontmatter: {}, body: content };
  }

  // Parse YAML-like frontmatter (simple key: value pairs)
  const frontmatter: Record<string, string> = {};
  for (let i = 1; i < endIndex; i++) {
    const line = lines[i];
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  const body = lines.slice(endIndex + 1).join('\n').trim();
  return { frontmatter, body };
}

/**
 * Extract **Time**: X minutes from content
 */
function extractTimeNote(content: string): { timeNote?: string; content: string } {
  const timeMatch = content.match(/\*\*Time\*\*:\s*(\d+)\s*minutes?/i);
  if (timeMatch) {
    const timeNote = `${timeMatch[1]} minutes`;
    // Remove the time line from content
    const cleanedContent = content.replace(/\*\*Time\*\*:\s*\d+\s*minutes?\n*/i, '');
    return { timeNote, content: cleanedContent };
  }
  return { content };
}

/**
 * Extract a title from slide content
 */
function extractTitle(content: string): string {
  // Try to find a heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match) return h2Match[1].trim();

  // Fallback: first non-empty line
  const firstLine = content.split('\n').find(line => line.trim().length > 0);
  if (firstLine) {
    return firstLine.replace(/^#+\s*/, '').slice(0, 50).trim();
  }

  return 'Untitled';
}

/**
 * Detect appropriate layout based on content
 */
function detectLayout(content: string, isFirst: boolean): 'title' | 'content' | 'split' | 'code' | 'quote' {
  const trimmed = content.trim();

  // Title slide: first slide with just a heading (or heading + short subtitle)
  if (isFirst) {
    const lines = trimmed.split('\n').filter(l => l.trim());
    if (lines.length <= 3 && lines[0]?.startsWith('#')) {
      return 'title';
    }
  }

  // Quote slide: primarily a blockquote
  if (trimmed.startsWith('>') && !trimmed.includes('```')) {
    const nonQuoteLines = trimmed.split('\n').filter(l => !l.startsWith('>') && l.trim());
    if (nonQuoteLines.length <= 2) {
      return 'quote';
    }
  }

  // Code slide: has significant code blocks
  const codeBlocks = trimmed.match(/```[\s\S]*?```/g) || [];
  const codeLength = codeBlocks.reduce((sum, block) => sum + block.length, 0);
  if (codeLength > trimmed.length * 0.4) {
    return 'code';
  }

  // Split slide: has both code and significant text, or has a two-column feel
  if (codeBlocks.length > 0 && trimmed.length - codeLength > 200) {
    return 'split';
  }

  return 'content';
}

/**
 * Extract facilitator notes from blockquotes
 */
function extractFacilitatorNotes(content: string): { notes?: string; content: string } {
  // Look for blockquotes that seem like facilitator notes
  const notePatterns = [
    /^>\s*"([^"]+)"$/gm,  // > "quoted text"
    /^>\s*Facilitator[:\s]+(.+)$/gim,  // > Facilitator: ...
  ];

  const notes: string[] = [];
  let cleanedContent = content;

  for (const pattern of notePatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length < 200) {  // Only short notes
        notes.push(match[1].trim());
      }
    }
  }

  if (notes.length > 0) {
    return { notes: notes.join(' | '), content: cleanedContent };
  }

  return { content };
}

/**
 * Parse a curriculum markdown file into slides
 */
function parseCurriculumFile(filePath: string): ParsedCurriculum {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Step 1: Parse frontmatter
  const { frontmatter, body } = parseFrontmatter(content);

  // Step 2: Extract time note
  const { timeNote, content: bodyWithoutTime } = extractTimeNote(body);

  // Step 3: Split on horizontal rules (---)
  // Be careful not to split on frontmatter-style delimiters or code blocks
  const slides: { content: string; suggestedTitle: string }[] = [];

  // Split by --- that appears on its own line (not in code blocks)
  let inCodeBlock = false;
  const lines = bodyWithoutTime.split('\n');
  let currentSlide: string[] = [];

  for (const line of lines) {
    // Track code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    // Check for HR (--- on its own line, not in code block)
    if (!inCodeBlock && /^-{3,}$/.test(line.trim())) {
      if (currentSlide.length > 0) {
        const slideContent = currentSlide.join('\n').trim();
        if (slideContent) {
          slides.push({
            content: slideContent,
            suggestedTitle: extractTitle(slideContent)
          });
        }
      }
      currentSlide = [];
    } else {
      currentSlide.push(line);
    }
  }

  // Don't forget the last slide
  if (currentSlide.length > 0) {
    const slideContent = currentSlide.join('\n').trim();
    if (slideContent) {
      slides.push({
        content: slideContent,
        suggestedTitle: extractTitle(slideContent)
      });
    }
  }

  return { frontmatter, timeNote, slides };
}

/**
 * Generate frontmatter for a slide
 */
function generateFrontmatter(meta: SlideMetadata): string {
  const lines = [
    '---',
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    `part: ${meta.part}`,
    `order: ${meta.order}`,
  ];

  if (meta.layout) {
    lines.push(`layout: "${meta.layout}"`);
  }

  if (meta.notes) {
    lines.push(`notes: "${meta.notes.replace(/"/g, '\\"')}"`);
  }

  if (meta.sourceFile) {
    lines.push(`sourceFile: "${meta.sourceFile}"`);
  }

  lines.push('---');

  return lines.join('\n');
}

/**
 * Migrate a single curriculum file to slides
 */
function migrateFile(
  sourcePath: string,
  outputDir: string,
  part: number,
  startOrder: number
): number {
  const parsed = parseCurriculumFile(sourcePath);
  const sourceFileName = path.basename(sourcePath, '.md');

  console.log(`  ${sourceFileName}: ${parsed.slides.length} slides`);

  let order = startOrder;

  for (let i = 0; i < parsed.slides.length; i++) {
    const slide = parsed.slides[i];
    const isFirst = i === 0;

    // Extract notes from content
    const { notes, content } = extractFacilitatorNotes(slide.content);

    const meta: SlideMetadata = {
      title: slide.suggestedTitle,
      part,
      order,
      layout: detectLayout(slide.content, isFirst),
      notes: isFirst && parsed.timeNote
        ? (notes ? `${parsed.timeNote} | ${notes}` : parsed.timeNote)
        : notes,
      sourceFile: sourceFileName
    };

    const outputFileName = `${String(order).padStart(2, '0')}-${slugify(slide.suggestedTitle)}.md`;
    const outputPath = path.join(outputDir, outputFileName);

    const fileContent = `${generateFrontmatter(meta)}\n\n${content}`;

    fs.writeFileSync(outputPath, fileContent);
    order++;
  }

  return order;
}

/**
 * Create a URL-friendly slug from a title
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

/**
 * Migrate an entire curriculum part directory
 */
function migratePart(sourceDir: string, outputDir: string, part: number): void {
  console.log(`\nMigrating Part ${part}: ${sourceDir} -> ${outputDir}`);

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Get all markdown files (excluding README)
  const files = fs.readdirSync(sourceDir)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .sort();

  let order = 1;

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    order = migrateFile(sourcePath, outputDir, part, order);
  }

  console.log(`  Total: ${order - 1} slides`);
}

/**
 * Migrate all curriculum parts
 */
function migrateAll(rootDir: string): void {
  const parts = [
    { source: 'curriculum/01-concepts', output: 'site/src/content/slides/01-concepts', part: 1 },
    { source: 'curriculum/02-cli-differences', output: 'site/src/content/slides/02-cli', part: 2 },
    { source: 'curriculum/03-hands-on', output: 'site/src/content/slides/03-hands-on', part: 3 },
    { source: 'curriculum/04-inspiration', output: 'site/src/content/slides/04-inspiration', part: 4 },
  ];

  for (const { source, output, part } of parts) {
    const sourceDir = path.join(rootDir, source);
    const outputDir = path.join(rootDir, output);

    if (fs.existsSync(sourceDir)) {
      migratePart(sourceDir, outputDir, part);
    } else {
      console.log(`Skipping ${source} (not found)`);
    }
  }
}

// Main execution
const args = process.argv.slice(2);

if (args[0] === '--all') {
  const rootDir = process.cwd();
  migrateAll(rootDir);
} else if (args.length >= 2) {
  const [sourceDir, outputDir] = args;
  const part = parseInt(args[2] || '1', 10);
  migratePart(sourceDir, outputDir, part);
} else {
  console.log('Usage:');
  console.log('  npx tsx scripts/migrate-curriculum.ts --all');
  console.log('  npx tsx scripts/migrate-curriculum.ts <source-dir> <output-dir> [part-number]');
  process.exit(1);
}
