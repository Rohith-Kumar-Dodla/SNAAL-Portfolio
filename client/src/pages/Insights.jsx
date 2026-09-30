import { ArrowRight, Quote } from "lucide-react";
import { useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { InsightCard } from "../components/content";
import {
  Badge,
  Button,
  ErrorState,
  EmptyState,
  Loading,
  PageHeader,
  PageMotion,
  Section,
  SectionHeader,
  Seo,
} from "../components/ui";
export function Insights() {
  const { insights, loading } = useContent();
  if (loading) return <Loading />;
  const featured = insights.find((x) => x.featured);
  return (
    <PageMotion>
      <PageHeader
        path="/insights"
        eyebrow="Insights"
        title="Engineering ideas, explained for useful decisions."
        copy="Practical perspectives on products, platforms and delivery from the work of building software."
      />
      <Section>
        {!insights.length ? <EmptyState title="Insights are being prepared" copy="Published articles will appear here." /> : <InsightCard article={featured || insights[0]} large />}
        <div className="mt-20 grid gap-x-7 gap-y-14 md:grid-cols-3">
          {insights
            .filter((x) => !x.featured)
            .map((x) => (
              <InsightCard key={x.slug} article={x} />
            ))}
        </div>
      </Section>
      <Section className="bg-canvas">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow="A useful technical conversation"
            title="Bring the context behind your next product decision."
          />
          <Button to="/contact">
            Start a conversation <ArrowRight size={17} />
          </Button>
        </div>
      </Section>
    </PageMotion>
  );
}
export function InsightDetail() {
  const { insights, loading } = useContent();
  const { slug } = useParams();
  if (loading) return <Loading />;
  const article = insights.find((x) => x.slug === slug);
  if (!article)
    return (
      <PageMotion>
        <PageHeader
          eyebrow="Insight not found"
          title="That article isn’t available."
          copy="It may have moved or the link may be incorrect."
        />
        <Section>
          <ErrorState message="We could not find this insight." />
          <Button to="/insights" className="mt-7">
            View all insights
          </Button>
        </Section>
      </PageMotion>
    );
  const related = insights.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <PageMotion>
      <Seo path={`/insights/${slug}`} title={article.seo?.title || article.title} description={article.seo?.description || article.excerpt} image={article.coverImage?.url} type="article" structuredData={{"@context":"https://schema.org","@type":"Article",headline:article.title,description:article.excerpt,image:article.coverImage?.url,author:article.author?{"@type":"Person",name:article.author}:undefined,datePublished:article.publishedAt}} />
      <article>
        <header className="blueprint-glow border-b border-line pb-20 pt-40">
          <div className="page-container max-w-5xl">
            <Badge>{article.category}</Badge>
            <h1 className="h1 mt-7 text-balance">{article.title}</h1>
            <p className="body-lg mt-7 max-w-3xl text-muted">
              {article.excerpt}
            </p>
            <p className="mt-7 text-sm font-medium text-muted">
              {article.author} · {article.date} · {article.readTime}
            </p>
          </div>
        </header>
        <Section>
          <div className="mx-auto max-w-3xl">
            {article.body.map((block, i) => (
              <section key={block.heading} className="mb-14">
                <h2 className="h2">{block.heading}</h2>
                {block.paragraphs.map((p) => (
                  <p key={p} className="mt-6 text-lg leading-8 text-slate-700">
                    {p}
                  </p>
                ))}
                {i === 0 && (
                  <blockquote className="my-10 border-l-4 border-brand-600 bg-brand-50 p-6 text-xl font-medium leading-8">
                    <Quote className="mb-4 text-brand-400" />
                    Design decisions become stronger when the operational
                    context stays visible.
                  </blockquote>
                )}
              </section>
            ))}
          </div>
        </Section>
      </article>
      <Section className="bg-canvas">
        <SectionHeader
          eyebrow="Related reading"
          title="Continue the conversation."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {related.map((x) => (
            <InsightCard key={x.slug} article={x} />
          ))}
        </div>
      </Section>
    </PageMotion>
  );
}
