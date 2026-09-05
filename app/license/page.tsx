// Public summary of the repository's source-available licence | TypeScript
import LegalPage from "@/components/LegalPage";
import { generateCollectionMetadata } from "@/lib/seo";

export const metadata = generateCollectionMetadata({
  title: "Source Licence & Commercial Tool Use | NYTM",
  description: "Understand NSAL v1.1: free hosted-tool use for personal and client work, source-code restrictions, contribution permissions and third-party licences.",
  path: "/license",
  keywords: ["NYTM licence", "NSAL", "commercial tool use", "source available"],
});

export default function LicensePage() {
  return <LegalPage title="Source licence" summary="NYTM uses the NYTM Source Available License (NSAL) v1.1. The hosted tools can be used for client work; permission to reuse the application's source code is more limited." sections={[
    { id: "allowed", title: "What you can do", content: <ul>
      <li>Use the official hosted tools and their outputs for lawful personal, educational and commercial work.</li>
      <li>Read the source and keep a private local copy to evaluate or test it.</li>
      <li>Fork, modify and submit changes for a contribution under the licence&apos;s conditions.</li>
      <li>Link to NYTM. Ordinary outputs do not require attribution unless a third-party licence requires it.</li>
    </ul> },
    { id: "permission", title: "What needs written permission", content: <p>Rehosting the application, selling or redistributing its original code, white-labelling it, or incorporating protected code or assets into another product generally needs written permission. Public availability is not an open-source licence. Contact Nityam Sheth at hello@nytm.in or hello@nsheth.in with the proposed use.</p> },
    { id: "third-parties", title: "Your content and third-party rights", content: <p>You keep your existing rights in inputs and contributions. The licence does not claim ownership of your client files or override licences for dependencies, fonts, models or bundled engines. Those materials retain their own terms, including applicable attribution, source-disclosure or copyleft obligations.</p> },
    { id: "full-text", title: "Read the controlling licence", content: <>
      <p>This page is a summary. The full LICENSE file supplied with the relevant source version controls source permissions. Hosted-service use also has separate Terms and a Privacy Policy. Future licence changes do not retrospectively change grants for older copies.</p>
      <a href="https://github.com/nityam2007/nytm-multitools/blob/main/LICENSE" className="btn btn-primary">Read full NSAL v1.1 on GitHub</a>
    </> },
  ]} />;
}
