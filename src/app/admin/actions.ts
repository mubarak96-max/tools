'use server';

import { adminDb } from "@/lib/firebase-admin";
import { Tool } from "@/types/database";
import { generateFullTool, generateCustomPage } from "@/lib/openrouter";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTool(data: Partial<Tool>) {
  if (!adminDb) throw new Error("Firebase not initialized");
  
  const slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (!slug) throw new Error("Tool name is required to generate a slug");

  const docRef = adminDb.collection('tools').doc(slug);
  const doc = await docRef.get();
  
  if (doc.exists) {
    throw new Error("A tool with this slug already exists.");
  }

  await docRef.set({
    ...data,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath('/admin/tools');
  revalidatePath('/');
  revalidatePath('/tools');
  redirect('/admin/tools');
}

export async function updateTool(slug: string, data: Partial<Tool>) {
  if (!adminDb) throw new Error("Firebase not initialized");

  const docRef = adminDb.collection('tools').doc(slug);
  await docRef.update({
    ...data,
    updatedAt: new Date(),
  });

  revalidatePath('/admin/tools');
  revalidatePath(`/tools/${slug}`);
  revalidatePath('/');
  revalidatePath('/tools');
  redirect('/admin/tools');
}

export async function deleteTool(slug: string) {
  if (!adminDb) throw new Error("Firebase not initialized");

  await adminDb.collection('tools').doc(slug).delete();

  revalidatePath('/admin/tools');
  revalidatePath('/');
  revalidatePath('/tools');
}

export async function generateFullToolProfile(toolName: string, config: { categories: string[] }) {
  const profile = await generateFullTool(toolName, config.categories);
  if (!profile) {
    throw new Error("Failed to generate AI insights from OpenRouter.");
  }
  return profile;
}

export async function autoCreateTool(toolName: string, config: { categories: string[] }) {
  const profile = await generateFullToolProfile(toolName, config);
  if (!adminDb) throw new Error("Firebase not initialized");
  
  const slug = profile.slug || toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const docRef = adminDb.collection('tools').doc(slug);
  const doc = await docRef.get();
  if (doc.exists) {
    throw new Error("A tool with this name/slug already exists.");
  }
  
  const pricingMapping: any = { 'free': 'Free', 'freemium': 'Freemium', 'paid': 'Paid' };
  const diffMapping: any = { 'beginner': 'Beginner', 'intermediate': 'Intermediate', 'advanced': 'Advanced' };

  await docRef.set({
    name: toolName,
    slug,
    category: profile.category,
    pricing: pricingMapping[profile.pricing_model?.toLowerCase()] || 'Freemium',
    difficulty: diffMapping[profile.difficulty_level?.toLowerCase()] || 'Intermediate',
    pricingRange: profile.price_range,
    description: profile.description,
    useCases: profile.use_cases || [],
    features: profile.features || [],
    platforms: profile.platforms || [],
    aiInsights: {
      whyThisToolFits: profile.why_this_tool,
      bestFor: profile.best_for,
      antiRecommendation: profile.anti_recommendation,
      comparisonSummary: profile.comparison_summary,
      pros: profile.pros || [],
      cons: profile.cons || []
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath('/admin/tools');
  revalidatePath('/');
  revalidatePath('/tools');
  redirect(`/admin/tools/${slug}/edit`);
}

export async function createPage(data: Partial<any>) {
  if (!adminDb) throw new Error("Firebase not initialized");
  
  const slug = data.slug;
  if (!slug) throw new Error("Page slug is required");

  const docRef = adminDb.collection('pages').doc(slug);
  const doc = await docRef.get();
  
  if (doc.exists) {
    throw new Error("A page with this slug already exists.");
  }

  await docRef.set({
    ...data,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
  redirect('/admin/pages');
}

export async function updatePage(slug: string, data: Partial<any>) {
  if (!adminDb) throw new Error("Firebase not initialized");

  const docRef = adminDb.collection('pages').doc(slug);
  await docRef.update({
    ...data,
    updatedAt: new Date(),
  });

  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
  redirect('/admin/pages');
}

export async function deletePage(slug: string) {
  if (!adminDb) throw new Error("Firebase not initialized");

  await adminDb.collection('pages').doc(slug).delete();

  revalidatePath('/admin/pages');
  revalidatePath(`/p/${slug}`);
}

export async function autoCreateCustomPage(topic: string, templateType: 'comparison' | 'alternatives' | 'curated-list', toolsList: {slug: string, name: string, category: string}[]) {
  const profile = await generateCustomPage(topic, templateType, toolsList);
  if (!adminDb || !profile) throw new Error("Failed to generate page or database uninitialized.");
  
  const slug = profile.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const docRef = adminDb.collection('pages').doc(slug);
  const doc = await docRef.get();
  if (doc.exists) throw new Error("A page with this slug already exists.");
  
  await docRef.set({
    slug,
    title: profile.title,
    metaDescription: profile.metaDescription,
    templateType: profile.templateType,
    toolSlugs: profile.toolSlugs || [],
    editorialVerdict: profile.editorialVerdict,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath('/admin/pages');
  revalidatePath('/');
  revalidatePath(`/p/${slug}`);
  redirect(`/admin/pages/${slug}/edit`);
}

export async function createCategory(data: Partial<any>) {
  if (!adminDb) throw new Error("Firebase not initialized");
  const slug = data.slug;
  if (!slug) throw new Error("Slug is required");
  const docRef = adminDb.collection('categories').doc(slug);
  if ((await docRef.get()).exists) throw new Error("Category exists");
  await docRef.set({ ...data, slug, createdAt: new Date(), updatedAt: new Date() });
  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

export async function updateCategory(slug: string, data: Partial<any>) {
  if (!adminDb) throw new Error("Firebase not initialized");
  await adminDb.collection('categories').doc(slug).update({ ...data, updatedAt: new Date() });
  revalidatePath('/admin/categories');
  revalidatePath(`/tools/categories/${slug}`);
  redirect('/admin/categories');
}

export async function deleteCategory(slug: string) {
  if (!adminDb) throw new Error("Firebase not initialized");
  await adminDb.collection('categories').doc(slug).delete();
  revalidatePath('/admin/categories');
}
