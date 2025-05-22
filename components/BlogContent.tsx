'use client';

import { motion } from "framer-motion";
import Link from "next/link";

import type { Locale } from "@/lib/i18n-config";

interface BlogContentProps {
  lang: Locale;
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

export default function BlogContent({ lang, dictionary }: BlogContentProps) {
  const { title, subtitle, posts } = dictionary;
  const isRtl = lang === "ar";

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 max-w-screen-xl text-center"
        >
      <motion.div
         initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        className={isRtl ? "font-arabic text-right" : ""}
      >
        {/* Contenu supplémentaire si nécessaire */}
      </motion.div>

      <section className="w-full rounded-xl bg-gray-900 py-24 text-white">
        <div className="container mx-auto px-4 max-w-screen-xl ">
          <div className="mx-auto grid gap-16">
      
    <span className="relative">
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`mb-16 text-center text-3xl font-bold text-foreground md:text-4xl  text-white dark:text-white ${isRtl ? "font-arabic" : ""}`}
    style={{ display: 'inline-block', position: 'relative' }}
  >
    {title}
    <span className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-gold to-amber-300" style={{ width: '100%' }}></span>
  </motion.h2>
</span>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${lang}/blog/${post.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-gold/20 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:border-gold/40 hover:shadow-gold/10 "
                >
                 <h2 className="text-xl font-semibold text-gold dark:text-amber-300">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section></motion.div>
    </div>
  );
}
