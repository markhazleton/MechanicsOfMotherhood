import { ArrowRight, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function BlogSection() {
  return (
    <section id="blog" className="section-y bg-background">
      <div className="site-container">
        <div className="grid items-center gap-8 rounded-lg border border-border bg-card p-8 shadow-sm md:grid-cols-[auto_1fr_auto] md:p-10">
          <span className="grid size-14 place-items-center rounded-md bg-primary-soft text-primary-ink">
            <Newspaper size={26} aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow mb-2">From the blog</p>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Kitchen notes are coming soon
            </h2>
            <p className="mt-3 max-w-[60ch] text-muted-foreground">
              We're writing up cooking tips, meal-planning ideas, and stories from our kitchen
              to yours. Check back soon for new articles.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="justify-self-start md:justify-self-end"
            data-testid="button-view-blog"
          >
            <Link href="/blog/" aria-label="Visit the blog">
              Visit the blog
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
