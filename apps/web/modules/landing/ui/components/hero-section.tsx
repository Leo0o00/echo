import React from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { ChevronRight, CirclePlay } from "lucide-react"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <section className="h-screen bg-linear-to-b from-background to-muted">
          <div className="relative py-36">
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="md:w-1/2">
                <div>
                  <h1 className="max-w-md text-5xl font-medium text-balance md:text-6xl">
                    🤖AI powered B2B customer support platform
                  </h1>
                  <p className="my-8 max-w-2xl text-xl text-balance text-muted-foreground">
                    A web-based tool that allows you to provide your customers
                    with a comprehensive customer service experience. It starts
                    with AI-powered automated responses and also allows
                    customers to make voice calls that are automatically
                    answered by an AI agent (Powered by VAPI).
                  </p>

                  <div className="flex items-center gap-3">
                    <Link
                      className={cn(buttonVariants({ size: "lg" }), "pr-4.5")}
                      href="/dashboard/conversations"
                    >
                      <span className="text-nowrap">Get Started</span>
                      <ChevronRight className="opacity-50" />
                    </Link>
                    {/* <Button
                      key={2}
                      asChild
                      size="lg"
                      variant="outline"
                      className="pl-5"
                    >
                      <Link href="#link">
                        <CirclePlay className="fill-primary/25 stroke-primary" />
                        <span className="text-nowrap">Watch video</span>
                      </Link>
                    </Button> */}
                  </div>
                </div>

                {/* <div className="mt-10">
                  <p className="text-muted-foreground">Trusted by teams at :</p>
                  <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                    <div className="flex">
                      <Image
                        className="h-4 w-fit"
                        src="https://html.tailus.io/blocks/customers/column.svg"
                        alt="Column Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <Image
                        className="h-5 w-fit"
                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                        alt="Nvidia Logo"
                        height="20"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <Image
                        className="h-4 w-fit"
                        src="https://html.tailus.io/blocks/customers/github.svg"
                        alt="GitHub Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="mt-24 translate-x-12 perspective-near md:absolute md:top-40 md:-right-6 md:bottom-16 md:left-1/2 md:mt-0 md:translate-x-0">
              <div className="relative h-full before:absolute before:-inset-x-4 before:top-0 before:bottom-7 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border before:border-foreground/5 before:bg-foreground/5">
                <div className="relative h-full -translate-y-12 skew-x-6 overflow-hidden rounded-(--radius) border border-transparent bg-background shadow-md ring-1 shadow-foreground/10 ring-foreground/5">
                  <Image
                    src="/conversations_view.webp"
                    alt="app screen"
                    width="2880"
                    height="1842"
                    className="size-full object-cover object-top-left"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
