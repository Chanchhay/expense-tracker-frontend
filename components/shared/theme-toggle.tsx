"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = (e: React.MouseEvent) => {
        const isCurrentlyDark = resolvedTheme === "dark";
        const newTheme = isCurrentlyDark ? "light" : "dark";

        if (!("startViewTransition" in document)) {
            setTheme(newTheme);
            return;
        }

        const x = e.clientX;
        const y = e.clientY;

        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        );

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
                {
                    clipPath:
                        newTheme === "dark"
                            ? clipPath
                            : [...clipPath].reverse(),
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    pseudoElement:
                        newTheme === "dark"
                            ? "::view-transition-new(root)"
                            : "::view-transition-old(root)",
                },
            );
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground relative"
        >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
