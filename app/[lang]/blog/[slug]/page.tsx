import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AboutHero from "@/components/blog-hero"
interface BlogPostPageProps {
  params: { lang: Locale; slug: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = params;
  const dictionary = await getDictionary(lang);
  const post = dictionary.blogPage.posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  

  return (
    <div className="flex flex-col">
            <AboutHero dictionary={dictionary.blogPage} lang={lang} />
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/${lang}/blog`}
        className="inline-flex items-center text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 mb-8"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      
      </Link>

      <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
      </div>

      <div className="text-xl font-semibold text-gray-400 dark:text-amber-300">
        <span>{post.date}</span>
        <span className="mx-2">•</span>
        <span>{post.author}</span>
      </div>

      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>{post.excerpt}</p>
        {/* Ajoutez ici le contenu complet de l'article si disponible dans le dictionnaire */}
      </div>
    </div> </div>
  );
}