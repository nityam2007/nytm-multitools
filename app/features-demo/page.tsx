"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { Select } from "@/components/Select";
import { useToast } from "@/components/Toast";
import { Skeleton, SkeletonCard } from "@/components/Skeleton";

export default function NewFeaturesDemo() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const toast = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const simulateProcessing = async () => {
    setLoading(true);
    toast.info("Processing your request...");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setOutput("Processing complete! This is your result.");
    setLoading(false);
    toast.success("Processing completed successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">New Features Demo</h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Toast notifications, tooltips, and loading skeletons - all in one place!
        </p>
      </div>

      <div className="space-y-12">
        {/* Toast Notifications */}
        <section className="tool-container">
          <h2 className="text-2xl font-bold mb-4">Toast Notifications</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Global notifications that appear in bottom-right corner. Auto-dismiss after 4 seconds.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => toast.success("Success! Operation completed.")}>
              Show Success
            </Button>
            <Button variant="destructive" onClick={() => toast.error("Error! Something went wrong.")}>
              Show Error
            </Button>
            <Button variant="secondary" onClick={() => toast.info("Info: Processing your request...")}>
              Show Info
            </Button>
            <Button variant="outline" onClick={() => toast.warning("Warning! Please review this.")}>
              Show Warning
            </Button>
          </div>

          <div className="mt-6 alert alert-info">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              Toast works across ALL tools automatically! Just use <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded">useToast()</code> hook.
            </div>
          </div>
        </section>

        {/* Hover Tooltips */}
        <section className="tool-container">
          <h2 className="text-2xl font-bold mb-4">Hover Tooltips</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Buttons now show helpful tooltips on hover. Try hovering over the Copy/Download buttons below.
          </p>

          <OutputBox
            label="Output with Tooltips"
            value="Hover over the Copy and Download buttons to see tooltips!"
            downloadFileName="example.txt"
          />

          <div className="mt-6 alert alert-success">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              All OutputBox components now have tooltips automatically!
            </div>
          </div>
        </section>

        {/* Loading Skeletons */}
        <section className="tool-container">
          <h2 className="text-2xl font-bold mb-4">Loading Skeletons</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Show placeholder UI while content loads. Prevents layout shift and improves UX.
          </p>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold mb-3">Text Skeleton</p>
              <Skeleton variant="text" lines={3} />
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Rectangular Skeleton</p>
              <Skeleton variant="rectangular" height={200} />
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Circular Skeleton</p>
              <div className="flex gap-3">
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="circular" width={60} height={60} />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Pre-built Card Skeleton</p>
              <SkeletonCard />
            </div>
          </div>
        </section>

        {/* Complete Example */}
        <section className="tool-container">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            All features working together: Toast + Tooltips + Skeletons
          </p>

          {loading ? (
            <div className="space-y-6">
              <Skeleton variant="rectangular" height={240} />
              <Skeleton variant="rectangular" height={48} />
              <Skeleton variant="rectangular" height={240} />
            </div>
          ) : (
            <div className="space-y-6">
              <TextArea
                label="Input"
                placeholder="Enter something..."
                charCount
                helperText="This will be processed when you click the button"
              />

              <Button
                variant="primary"
                size="lg"
                onClick={simulateProcessing}
                fullWidth
              >
                Process with Loading State
              </Button>

              <OutputBox
                label="Output"
                value={output}
                stats={output ? [
                  { label: "Characters", value: output.length },
                  { label: "Words", value: output.split(' ').length }
                ] : []}
              />
            </div>
          )}

          <div className="mt-6 alert alert-warning">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm">
              Click the button above to see: Loading skeleton → Toast notification → Result
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="tool-container bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10">
          <h2 className="text-2xl font-bold mb-4">What Changed?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">One Import, Everywhere</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Import <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded">useToast()</code> once, use it anywhere in your tool
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Automatic Tooltips</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  All OutputBox copy/download buttons now show tooltips on hover
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Loading States</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Use Skeleton components for async operations - better UX, no layout shift
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Update Once, Apply Everywhere</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  All changes in <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded">globals.css</code> and components automatically update ALL tools
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
