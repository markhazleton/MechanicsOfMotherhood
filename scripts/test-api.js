// Test script to verify API connectivity
// Run this to test your API endpoints before running the full fetch

const RECIPE_API_BASE = process.env.RECIPE_API_BASE || 'https://webspark.markhazleton.com/api/recipespark';
const WEBCMS_API_BASE = process.env.WEBCMS_API_BASE || 'https://webspark.markhazleton.com/api/WebCMS/WebCMSApi';
const AUTH_TOKEN = process.env.WEBCMS_AUTH_TOKEN || '';

async function testEndpoint(url, headers = {}) {
  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(url, { headers });
    
    console.log(`  Status: ${response.status} ${response.statusText}`);
    console.log(`  Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  Response preview: ${JSON.stringify(data).substring(0, 200)}...`);
      return true;
    } else {
      const text = await response.text();
      console.log(`  Error response: ${text.substring(0, 200)}...`);
      return false;
    }
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing API Connectivity...\n');
  
  // Test RecipeSpark API
  console.log('📚 Testing RecipeSpark API:');
  const recipesOk = await testEndpoint(`${RECIPE_API_BASE}/recipes?pageSize=1`);
  console.log('');
  
  const categoriesOk = await testEndpoint(`${RECIPE_API_BASE}/categories`);
  console.log('');
  
  // Test WebCMS API
  if (AUTH_TOKEN) {
    console.log('🌐 Testing WebCMS API:');
    const headers = {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    };
    const websitesOk = await testEndpoint(`${WEBCMS_API_BASE}/websites?pageSize=1`, headers);
    console.log('');
  } else {
    console.log('🌐 WebCMS API: Skipping (no auth token)\n');
  }
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`  RecipeSpark Recipes: ${recipesOk ? '✅ OK' : '❌ Failed'}`);
  console.log(`  RecipeSpark Categories: ${categoriesOk ? '✅ OK' : '❌ Failed'}`);
  console.log(`  WebCMS API: ${AUTH_TOKEN ? (websitesOk ? '✅ OK' : '❌ Failed') : '⚠️ Skipped'}`);
  
  if (recipesOk || categoriesOk) {
    console.log('\n✅ Some APIs are working! You can run "npm run fetch-data" to get real data.');
  } else {
    console.log('\n⚠️ No APIs are responding. The app will use mock data.');
  }
  
  console.log('\n💡 To configure APIs:');
  console.log('   1. Copy .env.example to .env');
  console.log('   2. Update the API URLs and token in .env');
  console.log('   3. Run this test again: node scripts/test-api.js');
}

main().catch(console.error);
