// Product catalogue with embedded images and print-to-PDF export | TypeScript
"use client";
import { useState } from "react";
import { Workspace, Field, Notice } from "./ToolUI";
import { transformImage } from "@/lib/image-pipeline";
import {
  escapeHtml as h,
  printDocument,
  printableDocument,
  downloadText,
} from "@/lib/browser-files";
interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}
export default function CatalogueMaker() {
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const update = (id: number, patch: Partial<Product>) =>
    setProducts(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const valid =
    title.trim() && products.length > 0 && products.every((p) => p.name.trim());
  const body = `<h1>${h(title)}</h1><p>${h(contact)}</p><div class="grid">${products.map((p) => `<article class="product"><img src="${p.image}" alt="${h(p.name)}"><h2>${h(p.name)}</h2><strong>${h(p.price)}</strong><p>${h(p.description)}</p></article>`).join("")}</div>`;
  return (
    <Workspace
      slug="catalogue-maker"
      help="Create a printable product catalogue with up to 12 images. Images are resized locally and embedded in the exported HTML, so it opens without a server. Print / Save PDF uses your browser's print dialog. Enter currency and pricing as you want them displayed."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Catalogue title (required)"
          value={title}
          onChange={setTitle}
        />
        <Field
          label="Business contact details"
          value={contact}
          onChange={setContact}
        />
      </div>
      <label className="block text-sm font-medium">
        Add product photos (JPEG, PNG, WebP)
        <input
          type="file"
          className="block mt-2"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            e.target.value = "";
            if (files.length + products.length > 12) {
              setNotice("A catalogue can contain up to 12 products.");
              return;
            }
            setBusy(true);
            const next: Product[] = [];
            const errors: string[] = [];
            for (const file of files) {
              try {
                if (file.size > 10 * 1024 * 1024)
                  throw Error("Image must be smaller than 10 MB.");
                const blob = await transformImage(file, {
                  width: 1000,
                  height: 800,
                  fit: "contain",
                  type: "image/jpeg",
                  quality: 0.85,
                  background: "#ffffff",
                });
                const image = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(String(reader.result));
                  reader.onerror = () => reject(Error("Could not read image."));
                  reader.readAsDataURL(blob);
                });
                next.push({
                  id: Date.now() + next.length,
                  name: file.name.replace(/\.[^.]+$/, ""),
                  price: "",
                  description: "",
                  image,
                });
              } catch (error) {
                errors.push(`${file.name}: ${(error as Error).message}`);
              }
            }
            setProducts([...products, ...next]);
            setBusy(false);
            setNotice(errors.join("\n") || `${next.length} products added.`);
          }}
        />
      </label>
      <fieldset disabled={busy} className="space-y-8">
        {products.map((product, index) => (
          <article
            key={product.id}
            className="grid md:grid-cols-[180px_1fr] gap-5 border-b border-[var(--border)] pb-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-48 rounded bg-white"
            />
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label={`Product ${index + 1} name`}
                  value={product.name}
                  onChange={(v) => update(product.id, { name: v })}
                />
                <Field
                  label="Price (including currency)"
                  value={product.price}
                  onChange={(v) => update(product.id, { price: v })}
                />
              </div>
              <Field
                label="Product description"
                value={product.description}
                onChange={(v) => update(product.id, { description: v })}
                multiline
              />
              <div className="flex gap-3">
                <button
                  className="btn btn-secondary"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...products];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];
                    setProducts(next);
                  }}
                >
                  Move up
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setProducts(products.filter((p) => p.id !== product.id))
                  }
                >
                  Remove product {index + 1}
                </button>
              </div>
            </div>
          </article>
        ))}
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-primary"
          disabled={!valid || busy}
          onClick={() => {
            try {
              printDocument(title, body);
            } catch (e) {
              setNotice((e as Error).message);
            }
          }}
        >
          Print / Save PDF
        </button>
        <button
          className="btn btn-secondary"
          disabled={!valid || busy}
          onClick={() =>
            downloadText(
              printableDocument(title, body),
              "product-catalogue.html",
              "text/html;charset=utf-8",
            )
          }
        >
          Download catalogue HTML
        </button>
      </div>
      <Notice>{busy ? "Preparing product images..." : notice}</Notice>
    </Workspace>
  );
}
