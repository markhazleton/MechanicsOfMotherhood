import { useState } from "react";
import { Users, MessageCircle, Lightbulb, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import apiData from "@/data/api-data.json";

export default function CommunitySection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { metadata: stats } = apiData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      // Static app - show success message without actual submission
      toast({
        title: "Thanks for your interest!",
        description: "We're working on newsletter functionality. Please check back soon!",
      });
      setEmail("");
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  return (
  <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-brand-900 mb-4">
            Join the MoM Crew
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with fellow working moms who understand the daily grind. Share tips, troubleshoot problems, and celebrate wins together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center p-6 bg-accent-50 rounded-xl border border-accent-200/50">
            <CardContent className="pt-6">
              <div className="bg-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-brand-900">Active Community</h3>
              <p className="text-muted-foreground mb-4">
                Join <span className="font-semibold" data-testid="community-members-count">
                  {stats?.totalRecipes ? (stats.totalRecipes * 100).toLocaleString() : "15,000"}+
                </span> working moms sharing real solutions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-brand-50 rounded-xl border border-brand-200/50">
            <CardContent className="pt-6">
              <div className="bg-brand-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <MessageCircle className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-brand-900">Daily Support</h3>
              <p className="text-muted-foreground mb-4">
                Get answers to your questions from experienced mom engineers.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-neutral-50 rounded-xl border border-border">
            <CardContent className="pt-6">
              <div className="bg-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                <Lightbulb className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-brand-900">Exclusive Content</h3>
              <p className="text-muted-foreground mb-4">
                Access member-only recipes, meal plans, and workshop sessions.
              </p>
            </CardContent>
          </Card>
        </div>

  <div className="bg-gradient-to-r from-brand-800 to-brand-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg">
          <h3 className="font-mechanical text-2xl md:text-3xl font-bold mb-4">
            Ready to Join the Workshop?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Get instant access to our complete recipe database and join the most supportive community of working moms.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl text-neutral-900 focus:ring-2 focus:ring-accent-500 focus:outline-none"
              data-testid="newsletter-email-input"
              required
            />
            <Button
              type="submit"
              variant="accent"
              className="px-8 py-4 rounded-xl font-semibold whitespace-nowrap transition-all shadow"
              data-testid="button-start-building"
            >
              <Rocket className="mr-2" size={18} />
              Start Building
            </Button>
          </form>
          <p className="text-sm opacity-75 mt-4">
            Join for free. No spam, just practical tips and recipes.
          </p>
        </div>
      </div>
    </section>
  );
}
