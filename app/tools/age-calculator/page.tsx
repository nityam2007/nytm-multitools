"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("age-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "age-calculator");

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    nextBirthday: number;
  } | null>(null);

  useEffect(() => {
    if (!birthDate || !targetDate) {
      setAge(null);
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      setAge(null);
      return;
    }

    // Calculate age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total calculations
    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= target) {
      nextBday.setFullYear(nextBday.getFullYear() + 1);
    }
    const nextBirthday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    setAge({ years, months, days, totalDays, totalWeeks, totalMonths, nextBirthday });
  }, [birthDate, targetDate]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={targetDate}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Calculate Age On</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        {age && (
          <>
            <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-[var(--primary)]">{age.years}</div>
              <div className="text-xl text-[var(--muted-foreground)]">years old</div>
              <div className="mt-4 text-lg">
                {age.years} years, {age.months} months, {age.days} days
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-2xl font-bold">{age.totalDays.toLocaleString()}</div>
                <div className="text-sm text-[var(--muted-foreground)]">Total Days</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-2xl font-bold">{age.totalWeeks.toLocaleString()}</div>
                <div className="text-sm text-[var(--muted-foreground)]">Total Weeks</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-2xl font-bold">{age.totalMonths.toLocaleString()}</div>
                <div className="text-sm text-[var(--muted-foreground)]">Total Months</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-2xl font-bold">{(age.totalDays * 24).toLocaleString()}</div>
                <div className="text-sm text-[var(--muted-foreground)]">Total Hours</div>
              </div>
            </div>

            <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎂</div>
              <div className="text-lg font-semibold">
                {age.nextBirthday === 0
                  ? "Happy Birthday! 🎉"
                  : `${age.nextBirthday} days until your next birthday`}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <div className="text-[var(--muted-foreground)]">Minutes lived</div>
                <div className="font-mono font-bold">{(age.totalDays * 24 * 60).toLocaleString()}</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <div className="text-[var(--muted-foreground)]">Seconds lived</div>
                <div className="font-mono font-bold">{(age.totalDays * 24 * 60 * 60).toLocaleString()}</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <div className="text-[var(--muted-foreground)]">Heartbeats (avg)</div>
                <div className="font-mono font-bold">{(age.totalDays * 24 * 60 * 72).toLocaleString()}</div>
              </div>
            </div>
          </>
        )}

        {!age && birthDate && (
          <div className="text-center text-[var(--muted-foreground)] py-8">
            Please select a valid birth date before the target date
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
