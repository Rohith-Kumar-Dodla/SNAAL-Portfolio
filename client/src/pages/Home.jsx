import { ArrowRight, Check, MoveUpRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "../motion";
import { useContent } from "../context/ContentContext";
import { InsightCard, ProductVisual, ProjectCard } from "../components/content";
import {
  Badge,
  Button,
  LinkArrow,
  Loading,
  PageMotion,
  Reveal,
  Section,
  SectionHeader,
  Seo,
} from "../components/ui";

export default function Home() {
  const reducedMotion = useReducedMotion();
  const {
    services,
    projects,
    technologyGroups,
    insights,
    testimonials,
    siteContent,
    loading,
  } = useContent();
  const home = siteContent.home || {};
  const differentiators = home.differentiators || [];
  const industries = home.industries || [];
  const process = home.process || [];
  if (loading) return <Loading />;
  return (
    <PageMotion>
      <Seo path="/" title={home.hero?.title || "SNAAL"} description={home.hero?.description || "Technology products and engineering shaped around business outcomes."} structuredData={{"@context":"https://schema.org","@type":"WebSite",name:"SNAAL",url:import.meta.env.VITE_PUBLIC_URL||undefined}} />
      <section className="blueprint-glow relative overflow-hidden border-b border-line pt-32">
        <div className="page-container grid min-h-[780px] items-center gap-14 py-16 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionTokens.duration.fast, ease: motionTokens.ease.enter }}
            >
              <Badge>
                <Sparkles size={13} className="mr-1" />{" "}
                {home.hero?.eyebrow || "SNAAL"}
              </Badge>
            </motion.div>
            <motion.h1
              className="display mt-7 text-balance"
              initial={reducedMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reducedMotion ? 0 : motionTokens.stagger.medium,
                duration: reducedMotion ? 0 : motionTokens.duration.slow,
                ease: motionTokens.ease.enter,
              }}
            >
              {home.hero?.title || "SNAAL"}
            </motion.h1>
            <motion.p
              className="body-lg mt-7 max-w-2xl text-muted"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : motionTokens.stagger.medium * 2, duration: reducedMotion ? 0 : motionTokens.duration.normal }}
            >
              {home.hero?.description ||
                "Published website content is being prepared."}
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              initial={reducedMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : motionTokens.stagger.medium * 3, duration: reducedMotion ? 0 : motionTokens.duration.normal, ease: motionTokens.ease.enter }}
            >
              <Button to="/portfolio">
                Explore our work <ArrowRight size={17} />
              </Button>
              <Button to="/contact" variant="secondary">
                Start a conversation <MoveUpRight size={17} />
              </Button>
            </motion.div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm font-medium text-muted">
              <span>Strategy-led</span>
              <span>Engineering-focused</span>
              <span>Built to evolve</span>
            </div>
          </div>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reducedMotion ? 0 : motionTokens.stagger.medium * 2, duration: reducedMotion ? 0 : motionTokens.duration.slow, ease: motionTokens.ease.enter }}
          >
            <ProductVisual label="Connected SNAAL product system" />
          </motion.div>
        </div>
      </section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <Reveal>
            <p className="eyebrow">What SNAAL does</p>
            <h2 className="h2 mt-4">
              From first plan to a product that keeps improving.
            </h2>
            <div className="mt-8">
              <LinkArrow to="/about">Learn more about SNAAL</LinkArrow>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="body-lg text-muted">
              SNAAL connects product planning, experience design, engineering,
              deployment and continuous improvement so digital work stays
              aligned with the business behind it.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
              {["Plan", "Design", "Build", "Deploy", "Improve", "Scale"].map(
                (x, i) => (
                  <div key={x} className="bg-white p-5">
                    <span className="text-xs font-bold text-brand-500">
                      0{i + 1}
                    </span>
                    <p className="mt-6 font-display text-lg font-semibold">
                      {x}
                    </p>
                  </div>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </Section>
      <section className="border-y border-line bg-ink text-white">
        <div className="page-container grid sm:grid-cols-2 lg:grid-cols-5">
          {[
            "End-to-End Product Engineering",
            "Web & Mobile Development",
            "Cloud-Ready Architecture",
            "Data & Automation",
            "Long-Term Technical Partnership",
          ].map((x, i) => (
            <div
              key={x}
              className="border-b border-white/10 p-6 sm:border-r lg:border-b-0"
            >
              <span className="text-xs font-bold text-blue-300">0{i + 1}</span>
              <p className="mt-8 font-display font-semibold leading-6">{x}</p>
            </div>
          ))}
        </div>
      </section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              eyebrow="Services"
              title="Capability organized around the outcome."
              copy="A connected range of product, platform and automation services."
            />
            <div className="mt-8">
              <LinkArrow to="/services">Explore all services</LinkArrow>
            </div>
          </div>
          <div className="border-t border-line">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.slug}>
                  <article className="grid gap-5 border-b border-line py-7 sm:grid-cols-[60px_1fr_auto] sm:items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-brand-600">
                        0{i + 1}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {service.short}
                      </p>
                    </div>
                    <LinkArrow to={`/services/${service.slug}`}>
                      Explore
                    </LinkArrow>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>
      <Section className="bg-canvas">
        <SectionHeader
          eyebrow="Featured portfolio"
          title="Product decisions brought to life."
          copy="Demonstration case studies show the depth and presentation structure prepared for verified SNAAL work."
        />
        <div className="mt-14 space-y-20">
          {projects
            .filter((x) => x.featured)
            .map((x, i) => (
              <div
                key={x.slug}
                className={
                  i % 2
                    ? "lg:[&>article]:grid-cols-[.8fr_1.2fr] lg:[&>article>a]:order-2"
                    : ""
                }
              >
                <ProjectCard project={x} feature />
              </div>
            ))}
        </div>
        <div className="mt-14">
          <Button to="/portfolio" variant="secondary">
            View all projects <ArrowRight size={17} />
          </Button>
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <SectionHeader
            eyebrow="Technology expertise"
            title="Breadth without the logo wall."
            copy="Tools are presented by the responsibility they carry in a product system."
          />
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {technologyGroups.slice(0, 4).map((group) => (
              <div key={group.name} className="bg-white p-6">
                <h3 className="font-display text-xl font-semibold">
                  {group.name}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.slice(0, 4).map((x) => (
                    <span
                      key={x}
                      className="rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="bg-canvas">
        <SectionHeader
          eyebrow="Why SNAAL"
          title="Engineering choices that stay connected to the outcome."
        />
        <div className="mt-12 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map(({ title, copy }) => {
            const Icon = Check;
            return (
              <div key={title} className="border-t border-line py-7">
                <Icon className="text-brand-600" />
                <h3 className="h3 mt-7">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{copy}</p>
              </div>
            );
          })}
        </div>
      </Section>
      <Section>
        <SectionHeader
          eyebrow="How we work"
          title="A visible path from ambiguity to operation."
        />
        <div className="relative mt-14 grid gap-0 border-l border-brand-200 lg:grid-cols-6 lg:border-l-0 lg:border-t">
          {process.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="relative pb-10 pl-9 lg:px-3 lg:pb-0 lg:pt-9">
                <span className="absolute -left-4 top-0 grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white lg:-top-4 lg:left-3">
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-ink text-white">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Where we can help"
            title="Capability across different operating contexts."
            copy="These are solution areas SNAAL can support, not claims about unverified client engagements."
          />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
            {industries.map((x, i) => (
              <div key={x} className="bg-ink p-5 sm:p-6">
                <span className="text-xs text-blue-300">0{i + 1}</span>
                <p className="mt-5 font-display font-semibold">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      {testimonials.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Client perspective"
            title="What clients say."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote
                key={item._id}
                className="rounded-2xl border border-line bg-white p-7"
              >
                <p className="text-lg leading-8">“{item.quote}”</p>
                <footer className="mt-5 text-sm font-semibold">
                  {item.clientName}
                  {item.company ? ` · ${item.company}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}
      <Section className="bg-canvas">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Insights"
            title="Thinking from the work of building."
          />
          <LinkArrow to="/insights">View all insights</LinkArrow>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {insights.slice(0, 3).map((x) => (
            <InsightCard key={x.slug} article={x} />
          ))}
        </div>
      </Section>
      <Section>
        <div className="relative overflow-hidden rounded-[2rem] border border-brand-200 bg-brand-600 px-6 py-14 text-white sm:px-12 lg:px-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10" />
          <p className="eyebrow !text-blue-100">Start something useful</p>
          <h2 className="h2 mt-5 max-w-3xl">
            Have a project in mind? Let’s build it together.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
            Bring the business context. We’ll help turn it into a clear product
            and engineering conversation.
          </p>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact" variant="secondary">
              Start a conversation
            </Button>
            <Button
              to="/book-site-visit"
              className="border border-white/30 bg-transparent hover:bg-white/10"
            >
              Book a site visit <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </Section>
    </PageMotion>
  );
}
