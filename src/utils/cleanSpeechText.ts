/**
 * Cleans markdown formatting, links, bullet points, and code markers
 * before text is fed to browser SpeechSynthesis.
 * Ensures the assistant speaks naturally without reading out asterisks or hashtags.
 */
export function cleanSpeechText(input: string): string {
  if (!input) return '';

  return input
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove images and markdown links [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove headings (#, ##, etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italics: **text**, *text*, __text__, _text_
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove blockquotes (> text)
    .replace(/^\s*>\s+/gm, '')
    // Remove unordered list bullets (*, -, +)
    .replace(/^\s*[-*+]\s+/gm, '')
    // Remove ordered list numbers (1. )
    .replace(/^\s*\d+\.\s+/gm, '')
    // Collapse multiple spaces/newlines into single spacing
    .replace(/\s+/g, ' ')
    .trim();
}
