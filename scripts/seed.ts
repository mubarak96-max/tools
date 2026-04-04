import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local variables
config({ path: resolve(__dirname, '../.env.local') });

import { requireAdminDb } from '../src/lib/firebase-admin';
import { stripUndefinedValues, withTimestamps } from '../src/lib/db/shared';
import { Tool } from '../src/types/database';

const mockTools: Array<Partial<Tool>> = [
  {
    name: 'Notion',
    slug: 'notion',
    category: 'Productivity',
    useCases: ['Note taking', 'Project management', 'Wiki'],
    pricing: 'Freemium',
    pricingRange: '$0 - $15/user/mo',
    difficulty: 'Intermediate',
    platforms: ['Web', 'iOS', 'Android', 'Mac', 'Windows'],
    features: ['Databases', 'Real-time collaboration', 'Templates', 'AI Assistant'],
    integrations: ['Slack', 'Google Drive', 'GitHub', 'Figma'],
    description: 'An all-in-one workspace for your notes, tasks, wikis, and databases.',
    aiInsights: {
      whyThisToolFits: 'Notion provides unparalleled flexibility to build custom workflows without coding.',
      pros: ['Highly customizable', 'Strong community templates', 'All-in-one approach'],
      cons: ['Can be overwhelming to learn', 'Mobile app can be slow', 'Offline mode is limited'],
      bestFor: 'Teams and individuals who want full control over their organization systems.',
      antiRecommendation: 'Avoid Notion if you want a simple, rigid task list out of the box without setup.',
      comparisonSummary: 'Compared to Evernote, Notion offers much more structural flexibility and databases, but has a steeper learning curve.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'ChatGPT',
    slug: 'chatgpt',
    category: 'AI',
    useCases: ['Content creation', 'Coding', 'Research'],
    pricing: 'Freemium',
    pricingRange: '$0 - $20/mo',
    difficulty: 'Beginner',
    platforms: ['Web', 'iOS', 'Android'],
    features: ['Conversational AI', 'Code generation', 'Data analysis', 'Vision'],
    integrations: ['Zapier', 'Custom Plugins'],
    description: 'A powerful AI language model that can converse, write, and analyze complex topics.',
    aiInsights: {
      whyThisToolFits: 'ChatGPT is the most versatile generative AI tool for everyday tasks and deep professional work.',
      pros: ['Exceptional natural language understanding', 'Broad knowledge base', 'Easy to use chat interface'],
      cons: ['Can occasionally hallucinate facts', 'Privacy concerns for sensitive data', 'Paid version required for best model'],
      bestFor: 'Writers, coders, and professionals looking to automate repetitive text-based tasks.',
      antiRecommendation: 'Avoid for highly deterministic mathematical or factual analysis without human review.',
      comparisonSummary: 'Compared to Claude, ChatGPT often has more features (Plugins/Vision) but Claude sometimes feels more natural and safer in its responses.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  if (!process.env.FIREBASE_PROJECT_ID && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('❌ Firebase configuration not found in .env.local. Please make sure the placeholder values are updated.');
    process.exit(1);
  }

  const adminDb = requireAdminDb();
  const batch = adminDb.batch();
  const toolsCollection = adminDb.collection('tools');

  try {
    for (const tool of mockTools) {
      if (!tool.slug) {
        throw new Error(`Tool slug missing for ${tool.name ?? "unknown tool"}.`);
      }

      // Use the slug as the document ID for cleaner URLs and prevention of duplicates
      const docRef = toolsCollection.doc(tool.slug);
      const cleaned = stripUndefinedValues(tool);
      batch.set(docRef, withTimestamps(cleaned));
      console.log(`Prepared ${tool.name} for insertion.`);
    }

    await batch.commit();
    console.log('✅ Successfully seeded database with mock tools!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
