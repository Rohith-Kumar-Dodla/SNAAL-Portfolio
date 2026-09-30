import { ArrowRight, Boxes, Check } from "lucide-react";
import { useContent } from "../context/ContentContext";
import {
  Button,
  EmptyState,
  Loading,
  PageHeader,
  PageMotion,
  Reveal,
  Section,
  SectionHeader,
} from "../components/ui";
export default function Technologies() {
  const { technologyGroups, loading } = useContent();
  if (loading) return <Loading />;
  return (
    <PageMotion>
      <PageHeader
        path="/technologies"
        eyebrow="Technology"
        title="Tools chosen for the problem—not the trend."
        copy="A capability map designed to stay useful: organized by the role technology plays in a product, not by logo volume."
      />
      <Section>
        {!technologyGroups.length && <EmptyState title="Technology capabilities are being updated" />}
        <div className="grid gap-x-12 gap-y-0 lg:grid-cols-2">
          {technologyGroups.map((group, i) => (
            <Reveal key={group.name} delay={(i % 2) * 0.08}>
              <article className="grid gap-5 border-t border-line py-8 sm:grid-cols-[70px_1fr]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 font-display text-sm font-bold text-brand-700">
                  0{i + 1}
                </span>
                <div>
                  <h2 className="h3">{group.name}</h2>
                  <p className="mt-3 leading-7 text-muted">
                    {group.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((x) => (
                      <span
                        key={x}
                        className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-canvas">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <Boxes className="text-brand-600" size={32} />
            <SectionHeader
              eyebrow="Selection principles"
              title="A stack is a set of responsibilities."
            />
          </div>
          <div className="grid gap-4">
            {[
              "Fit the product and operating constraints",
              "Stay understandable to the team that owns it",
              "Support reliable delivery and observation",
              "Leave room for the next useful stage",
            ].map((x) => (
              <div
                key={x}
                className="flex gap-4 border-b border-line py-5 font-display text-lg font-semibold"
              >
                <Check className="shrink-0 text-brand-600" />
                {x}
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeader
            eyebrow="Have a technical challenge?"
            title="The right conversation starts before the stack is fixed."
            copy="Share the product, workflow or platform decision you are working through."
          />
          <Button to="/contact">
            Talk with SNAAL <ArrowRight size={17} />
          </Button>
        </div>
      </Section>
    </PageMotion>
  );
}
