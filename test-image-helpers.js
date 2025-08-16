/**
 * Simple test to verify image helper functionality
 */
import { getRecipeImageUrl, getRecipeImageAlt } from '../utils/image-helpers';

// Test recipe with images
const recipeWithImage = {
  id: 1,
  name: 'Test Recipe',
  images: ['pasta-dish.jpg']
};

// Test recipe without images
const recipeWithoutImage = {
  id: 2, 
  name: 'Another Recipe',
  images: []
};

// Test recipe with null/undefined images
const recipeNullImages = {
  id: 3,
  name: 'Third Recipe'
};

console.log('🧪 Testing Image Helper Functions');
console.log('===============================');

console.log('\n1. Recipe with image:');
console.log('URL:', getRecipeImageUrl(recipeWithImage));
console.log('Alt:', getRecipeImageAlt(recipeWithImage));

console.log('\n2. Recipe without image:');
console.log('URL:', getRecipeImageUrl(recipeWithoutImage));
console.log('Alt:', getRecipeImageAlt(recipeWithoutImage));

console.log('\n3. Recipe with null images:');
console.log('URL:', getRecipeImageUrl(recipeNullImages));
console.log('Alt:', getRecipeImageAlt(recipeNullImages));

console.log('\n✅ All tests completed!');
