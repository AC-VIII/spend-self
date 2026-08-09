export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-you-need-to-spend-more-time-with-yourself",
    title: "Why You Need to Spend More Time With Yourself",
    excerpt:
      "In a world that constantly asks for your attention, making time for yourself isn't selfish. It's necessary.",
    category: "Mental Reset",
    author: "SpendSelf",
    date: "August 8, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "the-30-minute-digital-detox",
    title: "The 30-Minute Digital Detox That Actually Works",
    excerpt:
      "You don't need to disappear from the internet for a week. Sometimes 30 intentional minutes are enough to reset your mind.",
    category: "Digital Detox",
    author: "SpendSelf",
    date: "August 5, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "how-to-rest-without-feeling-guilty",
    title: "How to Rest Without Feeling Guilty",
    excerpt:
      "Rest isn't something you earn after being productive. It's part of what makes productivity sustainable.",
    category: "Self-Care",
    author: "SpendSelf",
    date: "August 2, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "your-brain-wasnt-designed-for-constant-notifications",
    title: "Your Brain Wasn't Designed for Constant Notifications",
    excerpt:
      "Every ping competes for your attention. Here's why creating quiet moments can make such a difference.",
    category: "Digital Wellness",
    author: "SpendSelf",
    date: "July 29, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "simple-ways-to-reset-your-mind",
    title: "7 Simple Ways to Reset Your Mind After a Long Day",
    excerpt:
      "You don't always need a vacation. These small rituals can help you transition from a busy day to a calmer evening.",
    category: "Mental Reset",
    author: "SpendSelf",
    date: "July 25, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "what-happens-when-you-stop-multitasking",
    title: "What Happens When You Stop Multitasking",
    excerpt:
      "Doing everything at once feels productive. But giving one thing your full attention can change how you work and think.",
    category: "Productivity",
    author: "SpendSelf",
    date: "July 20, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "a-simple-guide-to-mindful-mornings",
    title: "A Simple Guide to Mindful Mornings",
    excerpt:
      "How you spend the first hour of your day can influence everything that follows.",
    category: "Mindfulness",
    author: "SpendSelf",
    date: "July 16, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "can-ai-help-you-build-better-habits",
    title: "Can AI Help You Build Better Habits?",
    excerpt:
      "AI can be more than a productivity tool. Used thoughtfully, it can help you understand your patterns and make better choices.",
    category: "AI & Wellness",
    author: "SpendSelf",
    date: "July 10, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
];

export const categories = [
  "All",
  "Mental Reset",
  "Digital Detox",
  "Self-Care",
  "Digital Wellness",
  "Productivity",
  "Mindfulness",
  "AI & Wellness",
];