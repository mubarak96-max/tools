import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local variables
config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../src/lib/firebase-admin';
import { generateToolInsights } from '../src/lib/openrouter';
import { Tool } from '../src/types/database';

async function generateAllInsights() {
  console.log('🤖 Starting batch AI insight generation...');

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY is missing from .env.local!');
    process.exit(1);
  }

  const toolsCollection = adminDb.collection('tools');
  let toolsSnapshot;
  
  try {
    toolsSnapshot = await toolsCollection.get();
  } catch (error) {
    console.error('❌ Error fetching tools from Firestore:', error);
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const doc of toolsSnapshot.docs) {
    const rawData = doc.data();
    const tool = { id: doc.id, ...rawData } as Tool;

    if (tool.aiInsights) {
      console.log(`⏩ Skipping ${tool.name} - Insights already exist.`);
      skipCount++;
      continue;
    }

    console.log(`\n⏳ Generating insights for: ${tool.name}...`);
    const newInsights = await generateToolInsights(tool);

    if (newInsights) {
      try {
        await toolsCollection.doc(doc.id).update({
          aiInsights: newInsights,
          updatedAt: new Date()
        });
        console.log(`✅ Success: Updated insights for ${tool.name}`);
        successCount++;
        
        // Sleep to respect API rate limits
        await new Promise((r) => setTimeout(r, 1000));
      } catch (dbError) {
        console.error(`❌ Failed to update Firestore for ${tool.name}:`, dbError);
        failCount++;
      }
    } else {
      console.error(`❌ Failed to generate insights from OpenRouter for ${tool.name}`);
      failCount++;
    }
  }

  console.log('\n=============================================');
  console.log('🎉 Batch Generation Complete!');
  console.log(`✅ Generated: ${successCount}`);
  console.log(`⏩ Skipped: ${skipCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('=============================================');
}

generateAllInsights();
