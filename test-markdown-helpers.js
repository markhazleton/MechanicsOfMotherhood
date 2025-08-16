// Simple test for markdown helper functions (inline)

/**
 * Extracts the first paragraph from a description for use in summary cards
 */
function getDescriptionSummary(description) {
  if (!description) return '';
  
  // Remove markdown formatting for summary
  const plainText = description
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/__(.*?)__/g, '$1')     // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/_(.*?)_/g, '$1')       // Remove italic
    .replace(/\r?\n/g, ' ')          // Convert line breaks to spaces
    .trim();
  
  // Split by sentence-ending punctuation and take first complete sentence(s)
  // Look for the first paragraph break or double line break
  const paragraphs = plainText.split(/\r?\n\r?\n/);
  const firstParagraph = paragraphs[0] || plainText;
  
  // If first paragraph is too long, truncate at sentence boundary
  if (firstParagraph.length > 200) {
    const sentences = firstParagraph.split(/[.!?]+/);
    let summary = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      const potentialSummary = summary + (summary ? '. ' : '') + trimmedSentence;
      if (potentialSummary.length > 200) {
        break;
      }
      summary = potentialSummary;
    }
    
    return summary + (summary ? '.' : '');
  }
  
  return firstParagraph;
}

/**
 * Converts ingredients list from markdown string to HTML list
 */
function formatIngredientsAsHtml(ingredients) {
  if (!ingredients) return '';
  
  const ingredientsList = ingredients
    .split(/\r?\n/)
    .filter(line => line.trim())
    .map(ingredient => ingredient.replace(/^[-•]\s*/, '').trim())
    .filter(ingredient => ingredient.length > 0);
  
  if (ingredientsList.length === 0) return '';
  
  const listItems = ingredientsList
    .map(ingredient => `<li>${ingredient}</li>`)
    .join('');
  
  return `<ul>${listItems}</ul>`;
}

// Test data from the actual recipes
const testDescription = "Prepare to dazzle your guests with this **easy** and **show-stopping** dessert! Our *Backyard Bananas Foster* is not only **delicious** but comes with a bit of flaire, literally! Perfect for evening gatherings, this dish brings the taste of New Orleans right to your backyard. Watch as the bananas caramelize and the flames dance, making your dessert the highlight of the night.";

const testIngredients = "- 1 stick butter\r\n- 1/2 cup brown sugar\r\n- 4 bananas, peeled and halved lengthwise\r\n- 1/4 cup dark rum\r\n- 1/4 cup Triple Sec\r\n- Vanilla ice cream for serving";

console.log('=== Testing Markdown Helpers ===');

console.log('\n1. Original Description:');
console.log(testDescription);

console.log('\n2. Description Summary:');
console.log(getDescriptionSummary(testDescription));

console.log('\n3. Original Ingredients:');
console.log(testIngredients);

console.log('\n4. Ingredients HTML:');
console.log(formatIngredientsAsHtml(testIngredients));
