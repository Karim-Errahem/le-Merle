import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import BlogContent from "@/components/BlogContent";
import AboutHero from "@/components/blog-hero";

interface BlogPageProps {
  params: { lang: Locale };
  dictionary: {
    title: string;
    subtitle: string;
    posts: Array<{
      slug: string;
      title: string;
      excerpt: string;
      date: string;
    }>;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (<div className="flex flex-col">
   <AboutHero dictionary={dictionary.blogPage} lang={lang} />
     <div className="w-full mx-auto px-4 -mt-4">
  <BlogContent lang={lang} dictionary={dictionary.blogPage} /></div>
</div>

  )
}
