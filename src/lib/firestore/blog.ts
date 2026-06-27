import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export interface BlogPost {
  id: string; // URL slug or auto-id
  title: string;
  excerpt: string;
  content: string; // Markdown or rich text paragraphs
  category: string; // e.g. "Style", "Sustainability", "Craftsmanship", "Editorial"
  image: string; // Image URL or Base64 string
  author: string;
  publishDate: string;
  createdAt: number;
}

const SEEDED_POSTS: BlogPost[] = [
  {
    id: 'art-of-capsule-wardrobe',
    title: 'The Art of the Capsule Wardrobe',
    excerpt: 'How to curate a minimal, timeless collection of essentials that simplify your daily ritual and transcend seasonal trends.',
    category: 'Style',
    author: 'Styledora Editorial',
    publishDate: 'June 25, 2026',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
    content: `Creating a capsule wardrobe is more than a styling choice; it is a philosophy of mindful living. By focusing on quality over quantity, you create space for pieces that truly resonate with your personal aesthetic.

### The Foundation of Less
A capsule wardrobe begins with a simple premise: a collection of items that work harmoniously together. When every shirt pairs effortlessly with every trouser, the friction of dressing disappears. Choose neutral colors—warm sands, crisp whites, deep charcoal, and soft navy—to maximize versatility.

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

### Sourcing Quality
To build a wardrobe that lasts years instead of months, pay attention to the details. Look for neat, double-stitched seams, high-quality zippers, and natural fiber linings. Cotton, linen, wool, and silk drape beautifully and breathe naturally, making them far superior to synthetic alternatives.

### Care and Longevity
How you maintain your garments is as important as how you buy them. Wash at low temperatures, air dry when possible, and steam rather than iron. Handcrafted knitwear should always be folded, never hung, to preserve its shape.`
  },
  {
    id: 'sustainable-linen-sourcing',
    title: 'Sourcing Linen: A Sustainable Journey',
    excerpt: 'Trace the lifecycle of organic linen, from the flax fields of Belgium to our minimal patterns, designed for maximum breathability.',
    category: 'Sustainability',
    author: 'Styledora Editorial',
    publishDate: 'June 20, 2026',
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1528255671579-01b9e182ed1d?auto=format&fit=crop&q=80&w=1200',
    content: `Linen is one of the oldest textiles in human history, and yet it remains the ultimate modern fabric for sustainable living. Highly breathable, naturally cooling, and completely biodegradable, it is the cornerstone of our summer collections.

### The Flax Plant
Flax is an incredibly resilient crop. It requires no irrigation, relying solely on natural rainfall, and needs far fewer pesticides or fertilizers than conventional cotton. Every part of the plant is used—any flax fibers not suitable for spinning into linen are used to produce linseed oil, paper, and animal feed.

### The Craft of Weaving
Once harvested, flax undergoes retting and scutching to extract the soft long fibers. These fibers are then spun and woven by master artisans. Our linen is sourced directly from ethical, family-run mills in Europe, ensuring that traditional craftsmanship and fair labor practices are supported.

> "We do not inherit the earth from our ancestors, we borrow it from our children."

### A Fabric That Ages Gracefully
Unlike synthetic fabrics that degrade with use, linen gets softer and more lustrous with every single wash. Its natural wrinkles are not a defect, but a signature of relaxed, authentic elegance. Embrace the texture and wear it with pride.`
  },
  {
    id: 'atelier-craftsmanship-process',
    title: 'Inside the Atelier: The Detail of Stitching',
    excerpt: 'An intimate look at our production house, where slow fashion meets meticulous handcrafting and tailors spend hours on a single piece.',
    category: 'Craftsmanship',
    author: 'Styledora Editorial',
    publishDate: 'June 15, 2026',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
    content: `In an era of rapid industrialization and lightning-fast trends, our atelier chooses to walk a different path. We believe that true luxury lies in the hands of the maker, and in the hours dedicated to perfecting a single collar or cuff.

### The Slow Method
Our tailors work on small-batch production runs. This means we do not rush garments down a massive assembly line. Instead, one artisan is often responsible for assembling an entire jacket or dress from start to finish. This creates a deep connection to the piece and guarantees unmatched quality control.

### The Detail of Stitching
A Styledora shirt features 18 stitches per inch, ensuring seams that are exceptionally strong yet look incredibly refined. We utilize French seams on light fabrics for a completely clean inside finish, avoiding scratchy raw edges.

### The Human Element
Behind every silhouette is a story of expertise. Many of our master tailors have been practicing their craft for over two decades. By supporting their trade, we preserve invaluable heritage skills and celebrate the poetry of human touch in clothing.`
  }
];

export async function seedInitialBlogPosts() {
  try {
    const blogRef = collection(db, 'blog_posts');
    const q = query(blogRef);
    const snap = await getDocs(q);
    
    if (snap.empty) {
      console.log('Blog collection is empty. Seeding initial journal articles...');
      for (const post of SEEDED_POSTS) {
        const docRef = doc(db, 'blog_posts', post.id);
        await setDoc(docRef, post);
      }
      console.log('Seeding completed successfully!');
    }
  } catch (error) {
    console.error('Failed to seed blog posts:', error);
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Always seed first if empty
  await seedInitialBlogPosts();
  
  const blogRef = collection(db, 'blog_posts');
  const q = query(blogRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(d => d.data() as BlogPost);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, 'blog_posts', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as BlogPost;
  }
  return null;
}

export async function createOrUpdateBlogPost(post: Omit<BlogPost, 'createdAt'> & { createdAt?: number }): Promise<string> {
  const postId = post.id || globalThis.crypto?.randomUUID?.() || `post_${Date.now()}`;
  const docRef = doc(db, 'blog_posts', postId);
  
  const finalPost: BlogPost = {
    ...post,
    id: postId,
    createdAt: post.createdAt || Date.now()
  };
  
  await setDoc(docRef, finalPost);
  return postId;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, 'blog_posts', id);
  await deleteDoc(docRef);
}
