"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { FileUpload } from "@/components/FileUpload";

export default function ComponentShowcase() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [selected, setSelected] = useState(2);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Modern Swiss design system for NYTM MultiTools
        </p>
      </div>

      <div className="space-y-16">
        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Buttons</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">States</p>
              <div className="flex flex-wrap gap-3">
                <Button loading={true}>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>} iconPosition="left">With Icon</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Inputs</h2>
          <div className="space-y-6 max-w-2xl">
            <Input
              label="Basic Input"
              placeholder="Enter text..."
              helperText="This is helper text"
            />
            <Input
              label="With Icon"
              placeholder="Search..."
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
              iconPosition="left"
            />
            <Input
              label="With Error"
              placeholder="Enter email..."
              error="Invalid email address"
            />
          </div>
        </section>

        {/* TextArea */}
        <section>
          <h2 className="text-2xl font-bold mb-6">TextArea</h2>
          <div className="space-y-6">
            <TextArea
              label="Basic TextArea"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <TextArea
              label="With Character Count"
              placeholder="Type something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              charCount
              maxLength={500}
            />
          </div>
        </section>

        {/* OutputBox */}
        <section>
          <h2 className="text-2xl font-bold mb-6">OutputBox</h2>
          <OutputBox
            label="Sample Output"
            value='{\n  "example": "JSON output",\n  "features": ["copy", "download", "stats"]\n}'
            format="json"
            stats={[
              { label: "Lines", value: 4 },
              { label: "Size", value: "0.09 KB" }
            ]}
          />
        </section>

        {/* FileUpload */}
        <section>
          <h2 className="text-2xl font-bold mb-6">FileUpload</h2>
          <div className="max-w-2xl">
            <FileUpload
              label="Upload Image"
              onFileSelect={(file) => console.log(file)}
              helperText="Drag and drop or click to upload"
            />
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Alerts</h2>
          <div className="space-y-4 max-w-2xl">
            <div className="alert alert-info">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">This is an info alert with helpful information.</div>
            </div>
            <div className="alert alert-success">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">Success! Your operation completed successfully.</div>
            </div>
            <div className="alert alert-warning">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm">Warning! Please review before proceeding.</div>
            </div>
            <div className="alert alert-error">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">Error! Something went wrong.</div>
            </div>
          </div>
        </section>

        {/* Option Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Option Cards</h2>
          <div className="grid grid-cols-3 gap-3 max-w-2xl">
            {[2, 4, 8].map((size) => (
              <button
                key={size}
                onClick={() => setSelected(size)}
                className={`option-card ${selected === size ? 'active' : ''}`}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold">{size} spaces</div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">
                    {size === 2 ? 'Compact' : size === 4 ? 'Standard' : 'Wide'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-error">Error</span>
          </div>
        </section>

        {/* Form Controls */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Form Controls</h2>
          <div className="space-y-6 max-w-2xl">
            <div>
              <p className="text-sm font-semibold mb-3">Toggle Switch</p>
              <label className="toggle">
                <input type="checkbox" checked={toggle} onChange={(e) => setToggle(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Select Dropdown</p>
              <select className="select-modern">
                <option>Select an option...</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Checkbox</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox-modern" />
                <span className="text-sm">Accept terms and conditions</span>
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Radio Buttons</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="option" value="1" className="radio-modern" />
                  <span className="text-sm">Option 1</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="option" value="2" className="radio-modern" />
                  <span className="text-sm">Option 2</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Card */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Stats Card</h2>
          <div className="stats-card max-w-xs">
            <div className="stats-card-icon">
              <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">1,234</div>
              <div className="text-xs text-[var(--muted-foreground)]">Total conversions</div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Separator</h2>
          <div className="separator">
            <span>OR</span>
          </div>
        </section>
      </div>
    </div>
  );
}
