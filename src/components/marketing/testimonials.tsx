import { Quote } from "lucide-react";

import { Face } from "@/components/member-face";
import { Reveal, SectionHeading } from "@/components/motion";
import { testimonials } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="py-10 sm:py-16">
      <div className="shell">
        <SectionHeading
          label="From the community"
          title={
            <>
              Fewer emails. <span className="text-ink-faint">More episodes.</span>
            </>
          }
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08} className="h-full">
              <figure
                className={`flex h-full flex-col rounded-3xl p-6 transition-shadow duration-300 hover:shadow-e2 sm:p-7 ${
                  i === 1 ? "stage-soft" : "bg-surface"
                }`}
              >
                <Quote className="h-6 w-6 text-ink-faint" />
                <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-ink">{item.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-subtle pt-5">
                  <Face name={item.name} />
                  <div>
                    <p className="text-[14.5px] font-semibold text-ink">{item.name}</p>
                    <p className="text-[13px] text-ink-soft">{item.title}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
