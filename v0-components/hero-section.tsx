"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content Column */}
          <div className="flex flex-col gap-8">
            {/* Trust Badges */}
            <div
              className="flex flex-wrap gap-3"
              role="group"
              aria-label="Trust indicators"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-base font-medium"
              >
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>14-Day Free Trial</span>
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 text-base font-medium"
              >
                <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>Satisfaction Guaranteed</span>
              </Badge>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Independent Living After 50:{" "}
              <span className="text-primary">Master Tech Skills</span> for
              Freedom.
            </h1>

            {/* Subheadline */}
            <p className="max-w-xl text-pretty text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Essential tech skills for greater freedom, security, and
              independence after 50Plus.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col gap-4 sm:flex-row sm:gap-6"
              role="group"
              aria-label="Call to action"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-describedby="cta-description"
              >
                Learn Tech Skills
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-2 border-primary/50 px-8 text-lg font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-transparent"
              >
                Claim Your Independence
              </Button>
            </div>
            <p id="cta-description" className="sr-only">
              Start your journey to digital independence with our comprehensive
              tech courses designed for adults over 50
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">2,500+</span>{" "}
                learners empowered
              </p>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/20">
              <Image
                src="/images/hero-learners.jpg"
                alt="A diverse group of adults over 50 enthusiastically learning technology together in a modern, bright classroom environment"
                width={800}
                height={600}
                className="h-auto w-full object-cover"
                priority
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {/* Floating stats card */}
            <div
              className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card p-5 shadow-xl lg:-bottom-8 lg:-left-8"
              aria-label="Course statistics"
            >
              <p className="text-2xl font-bold text-primary">50PlusTech</p>
              <p className="text-base text-muted-foreground">
                Courses Available
              </p>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -right-4 -top-4 rounded-xl border border-border bg-card p-4 shadow-xl lg:-right-6 lg:-top-6"
              aria-label="Completion rate"
            >
              <p className="text-2xl font-bold text-accent">76%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
