import type { LucideIcon } from 'lucide-react';
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Music,
  Pin,
  AtSign,
  Cloud,
  MessageSquare,
  Ghost,
} from 'lucide-react';

export type CountMode = 'characters' | 'graphemes' | 'hashtags' | 'twitter_weighted';

export type PlatformLimit = {
  max: number;
  warn: number;
  label: string;
  note: string;
  mode?: CountMode;
};

export type SocialPlatform = {
  id: string;
  name: string;
  color: string;
  icon: LucideIcon;
  limits: Record<string, PlatformLimit>;
};

const URL_REGEX = /https?:\/\/[^\s]+/giu;
const HASHTAG_REGEX = /#[\p{L}\p{N}_]+/gu;
const MENTION_REGEX = /@[\p{L}\p{N}_.]+/gu;
const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

export const PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    icon: Instagram,
    limits: {
      caption: { max: 2200, label: 'Caption', warn: 125, note: "Only the first 125 chars show without 'more'" },
      bio: { max: 150, label: 'Bio', warn: 130, note: 'Shown on profile page' },
      username: { max: 30, label: 'Username', warn: 25, note: 'Letters, numbers, periods, underscores only' },
      name: { max: 30, label: 'Display Name', warn: 25, note: 'Shown above posts' },
      comment: { max: 2200, label: 'Comment', warn: 2000, note: 'Same limit as captions' },
      hashtags: { max: 30, label: 'Hashtags', warn: 25, note: 'Max 30 hashtags per post', mode: 'hashtags' },
      story_link: { max: 2048, label: 'Story Link', warn: 1800, note: 'Link sticker URL max' },
      alt_text: { max: 100, label: 'Alt Text', warn: 80, note: 'Image accessibility description' },
    },
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#000000',
    icon: Twitter,
    limits: {
      tweet: { max: 280, label: 'Tweet / Post', warn: 260, note: 'Every URL is weighted as 23 characters', mode: 'twitter_weighted' },
      bio: { max: 160, label: 'Bio', warn: 140, note: 'Profile description' },
      name: { max: 50, label: 'Display Name', warn: 40, note: 'Shown on profile' },
      username: { max: 15, label: 'Username (@)', warn: 12, note: 'Letters, numbers, underscores only' },
      dm: { max: 10000, label: 'Direct Message', warn: 9000, note: 'Twitter Blue subscribers' },
      poll_option: { max: 25, label: 'Poll Option', warn: 20, note: 'Each poll choice' },
      location: { max: 30, label: 'Location', warn: 25, note: 'Profile location field' },
      website_url: { max: 100, label: 'Website URL', warn: 90, note: 'Profile website field' },
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: Linkedin,
    limits: {
      post: { max: 3000, label: 'Post', warn: 2800, note: "Only the first 210 chars show before 'see more'" },
      headline: { max: 220, label: 'Headline', warn: 200, note: 'Shown under your name everywhere' },
      summary: { max: 2600, label: 'About / Summary', warn: 2400, note: 'First 300 chars visible without expanding' },
      name: { max: 100, label: 'Name', warn: 80, note: 'First + last name combined' },
      connection_note: { max: 300, label: 'Connect Note', warn: 280, note: 'Message when sending connection request' },
      comment: { max: 1250, label: 'Comment', warn: 1100, note: 'Post comment limit' },
      company_name: { max: 100, label: 'Company Name', warn: 80, note: 'Company page name' },
      article_title: { max: 150, label: 'Article Title', warn: 130, note: 'LinkedIn newsletter/article title' },
      job_title: { max: 100, label: 'Job Title', warn: 80, note: 'Position title' },
      skills: { max: 50, label: 'Skill Tag', warn: 40, note: 'Individual skill entry' },
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    icon: Facebook,
    limits: {
      post: { max: 63206, label: 'Post', warn: 50000, note: 'Technically up to 63,206 chars' },
      bio: { max: 101, label: 'Bio (Intro)', warn: 90, note: 'Short intro on profile' },
      about: { max: 50000, label: 'About Section', warn: 45000, note: 'Extended about page' },
      name: { max: 75, label: 'Name', warn: 60, note: 'First + last name' },
      page_name: { max: 75, label: 'Page Name', warn: 60, note: 'Business page name' },
      page_desc: { max: 255, label: 'Page Description', warn: 230, note: 'Short description below page name' },
      comment: { max: 8000, label: 'Comment', warn: 7000, note: 'Post comment' },
      group_desc: { max: 3000, label: 'Group Description', warn: 2700, note: 'Facebook Group description' },
      event_desc: { max: 1000, label: 'Event Description', warn: 900, note: 'Event details' },
      story_text: { max: 100, label: 'Story Text', warn: 80, note: 'Text overlay on Facebook Story' },
    },
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    icon: Music,
    limits: {
      caption: { max: 2200, label: 'Video Caption', warn: 150, note: 'First 150 chars shown; max 2,200 total' },
      bio: { max: 80, label: 'Bio', warn: 70, note: 'Profile description' },
      username: { max: 24, label: 'Username', warn: 20, note: 'Shown as @username' },
      name: { max: 30, label: 'Nickname', warn: 25, note: 'Display name on profile' },
      comment: { max: 150, label: 'Comment', warn: 130, note: 'Comment on videos' },
      stitch_text: { max: 300, label: 'Stitch Caption', warn: 280, note: 'Caption when stitching a video' },
      live_title: { max: 32, label: 'LIVE Title', warn: 28, note: 'TikTok LIVE stream title' },
    },
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#E60023',
    icon: Pin,
    limits: {
      pin_title: { max: 100, label: 'Pin Title', warn: 80, note: 'Title appears above description' },
      pin_desc: { max: 500, label: 'Pin Description', warn: 450, note: 'First 50 chars shown in feed' },
      board_name: { max: 50, label: 'Board Name', warn: 40, note: 'Name of your collection' },
      board_desc: { max: 500, label: 'Board Description', warn: 450, note: 'Board details' },
      bio: { max: 160, label: 'Bio', warn: 140, note: 'Profile description' },
      name: { max: 50, label: 'Display Name', warn: 40, note: 'Shown on your profile' },
      username: { max: 15, label: 'Username', warn: 12, note: 'Part of your Pinterest URL' },
      story_title: { max: 100, label: 'Story Pin Title', warn: 80, note: 'Story Pin page title' },
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    icon: Youtube,
    limits: {
      title: { max: 100, label: 'Video Title', warn: 70, note: 'Only about 60 chars show in search results' },
      description: { max: 5000, label: 'Description', warn: 4500, note: 'First 157 chars shown in search snippet' },
      tags: { max: 500, label: 'Tags (total)', warn: 450, note: 'Combined character count for all tags' },
      channel_desc: { max: 1000, label: 'Channel Description', warn: 900, note: 'About section of your channel' },
      channel_name: { max: 100, label: 'Channel Name', warn: 80, note: 'Your YouTube channel name' },
      comment: { max: 10000, label: 'Comment', warn: 9000, note: 'Video comment limit' },
      community: { max: 5000, label: 'Community Post', warn: 4500, note: 'YouTube Community tab post' },
      chapter: { max: 100, label: 'Chapter Title', warn: 80, note: 'Video chapter name in description' },
    },
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#101010',
    icon: AtSign,
    limits: {
      post: { max: 500, label: 'Post', warn: 450, note: 'Threads posts max 500 characters' },
      bio: { max: 150, label: 'Bio', warn: 130, note: 'Shared with Instagram profile' },
      name: { max: 30, label: 'Display Name', warn: 25, note: 'Synced from Instagram' },
    },
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    color: '#0085FF',
    icon: Cloud,
    limits: {
      post: { max: 300, label: 'Post', warn: 270, note: 'Bluesky uses grapheme-aware counting', mode: 'graphemes' },
      bio: { max: 256, label: 'Bio', warn: 230, note: 'Profile description' },
      name: { max: 64, label: 'Display Name', warn: 55, note: 'Shown on your profile' },
      username: { max: 253, label: 'Handle', warn: 200, note: 'Your @handle.bsky.social' },
    },
  },
  {
    id: 'mastodon',
    name: 'Mastodon',
    color: '#563ACC',
    icon: MessageSquare,
    limits: {
      post: { max: 500, label: 'Post / Toot', warn: 450, note: 'Default; some instances allow more' },
      bio: { max: 500, label: 'Bio', warn: 450, note: 'Profile description' },
      name: { max: 30, label: 'Display Name', warn: 25, note: 'Shown above handle' },
      cw: { max: 500, label: 'Content Warning', warn: 450, note: 'CW / spoiler text field' },
    },
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    color: '#FFFC00',
    icon: Ghost,
    limits: {
      story_caption: { max: 250, label: 'Story Caption', warn: 220, note: 'Caption on Snap stories' },
      bio: { max: 150, label: 'Bio', warn: 130, note: 'Profile description' },
      username: { max: 15, label: 'Username', warn: 12, note: 'Your Snapchat username' },
      name: { max: 30, label: 'Display Name', warn: 25, note: 'Shown to friends' },
      chat: { max: 1000, label: 'Chat Message', warn: 900, note: 'Direct chat message' },
    },
  },
];

function splitGraphemes(text: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }

  return Array.from(text);
}

export function countGraphemes(text: string) {
  return splitGraphemes(text).length;
}

export function extractUrls(text: string) {
  return Array.from(text.match(URL_REGEX) ?? []);
}

export function extractHashtags(text: string) {
  return Array.from(text.match(HASHTAG_REGEX) ?? []);
}

export function extractMentions(text: string) {
  return Array.from(text.match(MENTION_REGEX) ?? []);
}

export function extractEmojis(text: string) {
  return Array.from(text.match(EMOJI_REGEX) ?? []);
}

export function calculateTwitterWeightedCount(text: string) {
  let total = 0;
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const url = match[0];
    const start = match.index ?? 0;

    total += countGraphemes(text.slice(lastIndex, start));
    total += 23;
    lastIndex = start + url.length;
  }

  total += countGraphemes(text.slice(lastIndex));
  return total;
}

export function calculateFieldCount(text: string, limit: PlatformLimit) {
  switch (limit.mode) {
    case 'hashtags':
      return extractHashtags(text).length;
    case 'graphemes':
      return countGraphemes(text);
    case 'twitter_weighted':
      return calculateTwitterWeightedCount(text);
    case 'characters':
    default:
      return countGraphemes(text);
  }
}

export function getStatus(count: number, limit: { max: number; warn: number }) {
  if (count === 0) {
    return 'empty';
  }

  if (count > limit.max) {
    return 'over';
  }

  if (count >= limit.warn) {
    return 'warn';
  }

  return 'ok';
}

export function getDefaultFieldId(platform: SocialPlatform) {
  return Object.keys(platform.limits)[0];
}

export function getLimitUnitLabel(limit: PlatformLimit) {
  return limit.mode === 'hashtags' ? 'hashtags' : 'chars';
}

export function trimTextToLimit(text: string, limit: PlatformLimit) {
  if (calculateFieldCount(text, limit) <= limit.max) {
    return text;
  }

  if (limit.mode === 'hashtags') {
    return extractHashtags(text).slice(0, limit.max).join(' ');
  }

  const segments = splitGraphemes(text);
  let low = 0;
  let high = segments.length;
  let best = '';

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = segments.slice(0, middle).join('');
    const count = calculateFieldCount(candidate, limit);

    if (count <= limit.max) {
      best = candidate;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return best.trimEnd();
}

export function removeHashtagsFromText(text: string) {
  return text
    .replace(HASHTAG_REGEX, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function removeUrlsFromText(text: string) {
  return text
    .replace(URL_REGEX, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function countTextStats(text: string) {
  return {
    characters: countGraphemes(text),
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
    sentences: text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length,
    hashtags: extractHashtags(text).length,
    mentions: extractMentions(text).length,
    emojis: extractEmojis(text).length,
    urls: extractUrls(text).length,
  };
}
