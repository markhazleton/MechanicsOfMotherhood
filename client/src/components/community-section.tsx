import { BookOpen, Heart, ListChecks } from "lucide-react";
import apiData from "@/data/api-data.json";

export default function CommunitySection() {
  const { metadata: stats } = apiData;

  const values = [
    {
      icon: BookOpen,
      title: "A growing collection",
      body: (
        <>
          Browse{" "}
          <span className="font-semibold text-inverse-foreground" data-testid="community-members-count">
            {stats?.totalRecipes || "100"}+
          </span>{" "}
          recipes across {stats?.totalCategories || "14"} categories, from quick weeknight
          dinners to weekend projects.
        </>
      ),
    },
    {
      icon: Heart,
      title: "Family tested",
      body: <>Every recipe is cooked by real families and judged on two things: taste and ease.</>,
    },
    {
      icon: ListChecks,
      title: "Easy to follow",
      body: <>Clear ingredient lists and step-by-step instructions make cooking stress-free.</>,
    },
  ];

  return (
    <section className="section-y bg-inverse text-inverse-foreground">
      <div className="site-container">
        <p className="eyebrow mb-4 text-inverse-eyebrow">Why MoM recipes</p>
        <h2 className="max-w-3xl font-display text-[clamp(1.75rem,2vw+1rem,2.5rem)] font-bold leading-tight text-inverse-foreground">
          Real recipes, tested by real families — designed for busy lives.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-inverse-border pt-10 md:grid-cols-3 md:gap-8">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span className="mb-5 grid size-11 place-items-center rounded-md bg-primary text-primary-foreground">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-display text-xl font-bold text-inverse-foreground">{title}</h3>
              <p className="leading-relaxed text-inverse-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
