"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("world-clock")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "world-clock");

const defaultCities = [
  { id: "UTC", name: "UTC", country: "Universal" },
  { id: "America/New_York", name: "New York", country: "USA" },
  { id: "America/Los_Angeles", name: "Los Angeles", country: "USA" },
  { id: "Europe/London", name: "London", country: "UK" },
  { id: "Europe/Paris", name: "Paris", country: "France" },
  { id: "Asia/Dubai", name: "Dubai", country: "UAE" },
  { id: "Asia/Kolkata", name: "Mumbai", country: "India" },
  { id: "Asia/Shanghai", name: "Shanghai", country: "China" },
  { id: "Asia/Tokyo", name: "Tokyo", country: "Japan" },
  { id: "Australia/Sydney", name: "Sydney", country: "Australia" },
];

const allTimezones = [
  { id: "UTC", name: "UTC", country: "Universal" },
  { id: "America/New_York", name: "New York", country: "USA" },
  { id: "America/Chicago", name: "Chicago", country: "USA" },
  { id: "America/Denver", name: "Denver", country: "USA" },
  { id: "America/Los_Angeles", name: "Los Angeles", country: "USA" },
  { id: "America/Toronto", name: "Toronto", country: "Canada" },
  { id: "America/Vancouver", name: "Vancouver", country: "Canada" },
  { id: "America/Mexico_City", name: "Mexico City", country: "Mexico" },
  { id: "America/Sao_Paulo", name: "São Paulo", country: "Brazil" },
  { id: "Europe/London", name: "London", country: "UK" },
  { id: "Europe/Paris", name: "Paris", country: "France" },
  { id: "Europe/Berlin", name: "Berlin", country: "Germany" },
  { id: "Europe/Madrid", name: "Madrid", country: "Spain" },
  { id: "Europe/Rome", name: "Rome", country: "Italy" },
  { id: "Europe/Amsterdam", name: "Amsterdam", country: "Netherlands" },
  { id: "Europe/Moscow", name: "Moscow", country: "Russia" },
  { id: "Asia/Dubai", name: "Dubai", country: "UAE" },
  { id: "Asia/Kolkata", name: "Mumbai", country: "India" },
  { id: "Asia/Singapore", name: "Singapore", country: "Singapore" },
  { id: "Asia/Hong_Kong", name: "Hong Kong", country: "China" },
  { id: "Asia/Shanghai", name: "Shanghai", country: "China" },
  { id: "Asia/Tokyo", name: "Tokyo", country: "Japan" },
  { id: "Asia/Seoul", name: "Seoul", country: "South Korea" },
  { id: "Australia/Sydney", name: "Sydney", country: "Australia" },
  { id: "Australia/Melbourne", name: "Melbourne", country: "Australia" },
  { id: "Pacific/Auckland", name: "Auckland", country: "New Zealand" },
];

interface ClockData {
  id: string;
  name: string;
  country: string;
  time: string;
  date: string;
  offset: string;
  isDay: boolean;
}

export default function WorldClockPage() {
  const [selectedCities, setSelectedCities] = useState(defaultCities.slice(0, 6));
  const [clocks, setClocks] = useState<ClockData[]>([]);
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const newClocks = selectedCities.map(city => {
        const timeOptions: Intl.DateTimeFormatOptions = {
          timeZone: city.id,
          hour: "2-digit",
          minute: "2-digit",
          ...(showSeconds && { second: "2-digit" }),
          hour12: !is24Hour,
        };
        
        const dateOptions: Intl.DateTimeFormatOptions = {
          timeZone: city.id,
          weekday: "short",
          month: "short",
          day: "numeric",
        };

        const time = new Intl.DateTimeFormat("en-US", timeOptions).format(now);
        const date = new Intl.DateTimeFormat("en-US", dateOptions).format(now);
        
        // Calculate offset
        const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
        const cityDate = new Date(now.toLocaleString("en-US", { timeZone: city.id }));
        const diffHours = (cityDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
        const offsetStr = diffHours >= 0 ? `UTC+${diffHours}` : `UTC${diffHours}`;

        // Check if day or night (6am-6pm is day)
        const hour = parseInt(new Intl.DateTimeFormat("en-US", { 
          timeZone: city.id, 
          hour: "numeric", 
          hour12: false 
        }).format(now));
        const isDay = hour >= 6 && hour < 18;

        return {
          id: city.id,
          name: city.name,
          country: city.country,
          time,
          date,
          offset: offsetStr,
          isDay,
        };
      });
      setClocks(newClocks);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [selectedCities, is24Hour, showSeconds]);

  const addCity = (cityId: string) => {
    const city = allTimezones.find(c => c.id === cityId);
    if (city && !selectedCities.find(c => c.id === cityId)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(c => c.id !== cityId));
  };

  const availableCities = allTimezones.filter(
    tz => !selectedCities.find(c => c.id === tz.id)
  );

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={is24Hour}
                onChange={(e) => setIs24Hour(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">24-hour format</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSeconds}
                onChange={(e) => setShowSeconds(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Show seconds</span>
            </label>
          </div>
          
          {availableCities.length > 0 && (
            <select
              value=""
              onChange={(e) => addCity(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="">+ Add City</option>
              {availableCities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clocks.map(clock => (
            <div
              key={clock.id}
              className={`relative p-6 rounded-xl border border-[var(--border)] ${
                clock.isDay 
                  ? "bg-gradient-to-br from-blue-50 to-yellow-50 dark:from-blue-950 dark:to-yellow-950" 
                  : "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950"
              }`}
            >
              <button
                onClick={() => removeCity(clock.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--muted)] hover:bg-red-500 hover:text-white text-xs"
              >
                ×
              </button>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 text-[var(--foreground)]">
                  {clock.isDay ? (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{clock.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{clock.country}</div>
                </div>
              </div>
              
              <div className="font-mono text-3xl font-bold mb-1">
                {clock.time}
              </div>
              
              <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                <span>{clock.date}</span>
                <span>{clock.offset}</span>
              </div>
            </div>
          ))}
        </div>

        {clocks.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <p>No cities selected. Add a city to see its current time.</p>
          </div>
        )}

        <div className="bg-[var(--muted)] rounded-xl p-4">
          <h3 className="font-semibold mb-2">Quick Add</h3>
          <div className="flex flex-wrap gap-2">
            {defaultCities
              .filter(c => !selectedCities.find(sc => sc.id === c.id))
              .slice(0, 6)
              .map(city => (
                <button
                  key={city.id}
                  onClick={() => addCity(city.id)}
                  className="px-3 py-1 text-sm rounded-full bg-[var(--background)] hover:bg-[var(--accent)] border border-[var(--border)]"
                >
                  + {city.name}
                </button>
              ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
