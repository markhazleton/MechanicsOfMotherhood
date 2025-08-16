/**
 * Utility functions for handling markdown content in recipes
 */

/**
 * Converts markdown content to HTML string
 * Note: For security, this should only be used with trusted content
 */
export function markdownToHtml(markdownContent: string): string {
  if (!markdownContent) return "";

  // Simple markdown to HTML conversion for basic formatting
  return (
    markdownContent
      // Convert bold text (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")

      // Convert italic text (*text* or _text_)
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/_(.*?)_/g, "<em>$1</em>")

      // Convert line breaks
      .replace(/\r\n/g, "<br>")
      .replace(/\n/g, "<br>")

      // Convert list items (lines starting with - or •)
      .replace(/^[-•]\s+(.*)$/gm, "<li>$1</li>")

      // Wrap consecutive <li> elements in <ul>
      .replace(/(<li>[\s\S]*<\/li>)/g, "<ul>$1</ul>")

      // Convert numbered list items (lines starting with number.)
      .replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>")

      // Basic paragraph handling - split by double line breaks
      .split(/\r?\n\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0)
      .map((paragraph) => {
        // Don't wrap lists in paragraph tags
        if (
          paragraph.includes("<ul>") ||
          paragraph.includes("<ol>") ||
          paragraph.includes("<li>")
        ) {
          return paragraph;
        }
        return `<p>${paragraph}</p>`;
      })
      .join("")
  );
}

/**
 * Extracts the first paragraph from a description for use in summary cards
 */
export function getDescriptionSummary(description: string): string {
  if (!description) return "";

  // Remove markdown formatting for summary
  const plainText = description
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/__(.*?)__/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/_(.*?)_/g, "$1") // Remove italic
    .replace(/\r?\n/g, " ") // Convert line breaks to spaces
    .trim();

  // Split by sentence-ending punctuation and take first complete sentence(s)
  // Look for the first paragraph break or double line break
  const paragraphs = plainText.split(/\r?\n\r?\n/);
  const firstParagraph = paragraphs[0] || plainText;

  // If first paragraph is too long, truncate at sentence boundary
  if (firstParagraph.length > 200) {
    const sentences = firstParagraph.split(/[.!?]+/);
    let summary = "";

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const potentialSummary =
        summary + (summary ? ". " : "") + trimmedSentence;
      if (potentialSummary.length > 200) {
        break;
      }
      summary = potentialSummary;
    }

    return summary + (summary ? "." : "");
  }

  return firstParagraph;
}

/**
 * Converts ingredients list from markdown string to HTML list
 */
export function formatIngredientsAsHtml(ingredients: string): string {
  if (!ingredients) return "";

  const ingredientsList = ingredients
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((ingredient) => ingredient.replace(/^[-•]\s*/, "").trim())
    .filter((ingredient) => ingredient.length > 0);

  if (ingredientsList.length === 0) return "";

  const listItems = ingredientsList
    .map((ingredient) => `<li>${ingredient}</li>`)
    .join("");

  return `<ul>${listItems}</ul>`;
}

/**
 * Converts instructions from markdown string to HTML with numbered steps
 */
export function formatInstructionsAsHtml(instructions: string): string {
  if (!instructions) return "";

  const instructionsList = instructions
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((instruction) => {
      // Remove leading numbers and bullets
      return instruction
        .replace(/^\d+\.\s*/, "")
        .replace(/^[-•]\s*/, "")
        .trim();
    })
    .filter((instruction) => instruction.length > 0);

  if (instructionsList.length === 0) return "";

  const listItems = instructionsList
    .map((instruction) => `<li>${instruction}</li>`)
    .join("");

  return `<ol>${listItems}</ol>`;
}

/**
 * React component props for rendering markdown content safely
 */
export interface MarkdownContentProps {
  content: string;
  className?: string;
  summary?: boolean; // If true, show only first paragraph
}
