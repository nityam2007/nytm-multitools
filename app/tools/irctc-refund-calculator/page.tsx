// IRCTC Refund Calculator Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("irctc-refund-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "irctc-refund-calculator");

const CLASS_OPTIONS = [
  { value: "1A", label: "First AC (1A)" },
  { value: "2A", label: "Second AC (2A)" },
  { value: "3A", label: "Third AC (3A)" },
  { value: "SL", label: "Sleeper (SL)" },
  { value: "CC", label: "AC Chair Car (CC)" },
  { value: "EC", label: "Executive Class (EC)" },
  { value: "2S", label: "Second Sitting (2S)" },
];

const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed (CNF)" },
  { value: "rac", label: "RAC" },
  { value: "waitlist", label: "Waitlist (WL)" },
];

type TravelClass = "1A" | "2A" | "3A" | "SL" | "CC" | "EC" | "2S";
type TicketStatus = "confirmed" | "rac" | "waitlist";

export default function IrctcRefundCalculatorPage() {
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [cancellationDate, setCancellationDate] = useState("");
  const [cancellationTime, setCancellationTime] = useState("");
  const [ticketFare, setTicketFare] = useState("");
  const [travelClass, setTravelClass] = useState<TravelClass>("SL");
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("confirmed");
  const [isTatkal, setIsTatkal] = useState(false);

  const refundResult = useMemo(() => {
    if (!departureDate || !departureTime || !cancellationDate || !cancellationTime || !ticketFare) {
      return null;
    }

    const fare = parseFloat(ticketFare);
    if (fare <= 0) return null;

    const departureDateTime = new Date(`${departureDate}T${departureTime}`);
    const cancellationDateTime = new Date(`${cancellationDate}T${cancellationTime}`);
    const hoursDiff = (departureDateTime.getTime() - cancellationDateTime.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 0) return null;

    const GST_RATE = 0.05;
    let cancellationCharge = 0;
    let tatkalCharge = 0;

    if (isTatkal) {
      tatkalCharge = fare;
    } else if (ticketStatus === "confirmed") {
      if (hoursDiff >= 48) {
        const flatRate = travelClass === "EC" ? 240 : travelClass === "CC" ? 180 : travelClass === "2S" ? 60 : 240;
        cancellationCharge = flatRate * (1 + GST_RATE);
      } else if (hoursDiff >= 12) {
        const minRate = (travelClass === "EC" ? 240 : travelClass === "CC" ? 180 : 240) * (1 + GST_RATE);
        cancellationCharge = Math.max(fare * 0.25, minRate);
      } else if (hoursDiff >= 4) {
        const minRate = (travelClass === "EC" ? 240 : travelClass === "CC" ? 180 : 240) * (1 + GST_RATE);
        cancellationCharge = Math.max(fare * 0.50, minRate);
      } else {
        cancellationCharge = fare;
      }
    } else {
      cancellationCharge = hoursDiff >= 4 ? 20 * (1 + GST_RATE) : fare;
    }

    const totalDeduction = cancellationCharge + tatkalCharge;
    const refundAmount = Math.max(0, fare - totalDeduction);
    const refundPercentage = (refundAmount / fare) * 100;

    const days = Math.floor(hoursDiff / 24);
    const hours = Math.floor(hoursDiff % 24);
    const timeBeforeDeparture = days > 0 
      ? `${days}d ${hours}h` 
      : `${hours}h`;

    return { refundAmount, cancellationCharge, tatkalCharge, totalDeduction, refundPercentage, timeBeforeDeparture };
  }, [departureDate, departureTime, cancellationDate, cancellationTime, ticketFare, travelClass, ticketStatus, isTatkal]);

  const handleReset = () => {
    setDepartureDate("");
    setDepartureTime("");
    setCancellationDate("");
    setCancellationTime("");
    setTicketFare("");
    setTravelClass("SL");
    setTicketStatus("confirmed");
    setIsTatkal(false);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Form */}
        <div className="grid sm:grid-cols-2 gap-4">
          <DatePicker value={departureDate} onChange={setDepartureDate} label="Departure Date" required />
          <TimePicker value={departureTime} onChange={setDepartureTime} label="Departure Time" required />
          <DatePicker value={cancellationDate} onChange={setCancellationDate} label="Cancellation Date" required />
          <TimePicker value={cancellationTime} onChange={setCancellationTime} label="Cancellation Time" required />
          <Input
            label="Ticket Fare (₹)"
            type="number"
            value={ticketFare}
            onChange={(e) => setTicketFare(e.target.value)}
            placeholder="1500"
            required
          />
          <Select
            label="Travel Class"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value as TravelClass)}
            options={CLASS_OPTIONS}
          />
          <Select
            label="Ticket Status"
            value={ticketStatus}
            onChange={(e) => setTicketStatus(e.target.value as TicketStatus)}
            options={STATUS_OPTIONS}
          />
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isTatkal}
                onChange={(e) => setIsTatkal(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Tatkal Ticket (Non-Refundable)</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-5 py-2 rounded-lg bg-[var(--muted)] hover:opacity-80 transition-opacity text-sm font-medium"
        >
          Reset
        </button>

        {/* Results */}
        {refundResult && (
          <div className="p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30">
            <div className="text-center mb-4">
              <p className="text-sm text-[var(--muted-foreground)]">Estimated Refund</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                ₹{refundResult.refundAmount.toFixed(2)}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {refundResult.refundPercentage.toFixed(0)}% of ₹{parseFloat(ticketFare).toFixed(2)} • {refundResult.timeBeforeDeparture} before departure
              </p>
            </div>
            {refundResult.totalDeduction > 0 && (
              <div className="text-center text-sm text-red-500">
                Deduction: ₹{refundResult.totalDeduction.toFixed(2)}
                {refundResult.tatkalCharge > 0 && " (Tatkal - No Refund)"}
              </div>
            )}
          </div>
        )}

        {/* Rules */}
        <details className="text-sm">
          <summary className="cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Refund Rules & Disclaimer
          </summary>
          <div className="mt-3 p-4 rounded-lg bg-[var(--muted)]/50 space-y-2 text-[var(--muted-foreground)]">
            <p><strong>48+ hrs:</strong> Flat charge (₹240 AC / ₹180 CC / ₹60 2S) + GST</p>
            <p><strong>12-48 hrs:</strong> 25% fare (min flat rate)</p>
            <p><strong>4-12 hrs:</strong> 50% fare (min flat rate)</p>
            <p><strong>&lt;4 hrs:</strong> No refund</p>
            <p><strong>WL/RAC:</strong> ₹20 + GST</p>
            <p><strong>Tatkal:</strong> Non-refundable</p>
            <p className="pt-2 text-xs">This is an estimate only. Not affiliated with IRCTC. Verify at <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">irctc.co.in</a></p>
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}
