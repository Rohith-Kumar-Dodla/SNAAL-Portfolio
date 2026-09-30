import { ArrowRight, Compass, Eye } from "lucide-react";
import { useContent } from "../context/ContentContext";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loading,
  PageMotion,
  Reveal,
  Section,
  SectionHeader,
  Seo,
} from "../components/ui";
export default function About() {
  const { siteContent, loading } = useContent();
  if (loading) return <Loading />;
  const about = siteContent.about;
  if (!about)
    return (
      <PageMotion>
        <Section className="pt-36">
          <EmptyState
            title="About content is being prepared"
            copy="Published company information will appear here."
          />
        </Section>
      </PageMotion>
    );
  return (
    <PageMotion>
      <Seo path="/about" title={about.seo?.title || about.title} description={about.seo?.description || about.introduction} />
      <section className="blueprint-glow border-b border-line pb-24 pt-40">
        <div className="page-container">
          <Badge>{about.eyebrow || "About SNAAL"}</Badge>
          <h1 className="h1 mt-7 text-balance">{about.title}</h1>
          <p className="body-lg mt-7 max-w-2xl text-muted">
            {about.introduction}
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Who we are"
            title={about.whoWeAreTitle || about.title}
          />
          <div className="body-lg whitespace-pre-line text-muted">
            {about.story}
          </div>
        </div>
      </Section>
      <Section className="bg-canvas">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-8">
            <Compass className="text-brand-600" />
            <p className="eyebrow mt-8">Mission</p>
            <h2 className="h3 mt-4">{about.mission}</h2>
          </Card>
          <Card className="p-8">
            <Eye className="text-brand-600" />
            <p className="eyebrow mt-8">Vision</p>
            <h2 className="h3 mt-4">{about.vision}</h2>
          </Card>
        </div>
      </Section>
      {about.values?.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="What guides the work"
            title="Principles made practical."
          />
          <div className="mt-12 grid border-y border-line sm:grid-cols-2 lg:grid-cols-3">
            {about.values.map((value, i) => (
              <Reveal key={value} className="border-b border-line p-6">
                <span className="text-xs font-bold text-brand-600">
                  0{i + 1}
                </span>
                <h3 className="mt-8 font-display text-xl font-semibold">
                  {value}
                </h3>
              </Reveal>
            ))}
          </div>
        </Section>
      )}
      <Section className="bg-canvas">
        <div className="flex flex-wrap gap-3">
          <Button to="/contact">
            Discuss a project <ArrowRight size={17} />
          </Button>
          <Button to="/book-site-visit" variant="secondary">
            Book a site visit
          </Button>
        </div>
      </Section>
    </PageMotion>
  );
}
