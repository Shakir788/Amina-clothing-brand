import { useState } from "react";
import { useClient } from "sanity";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";

/**
 * Adds a "🌐 Auto-Translate" button to the product document's action bar.
 * Reads the English `name` + `description`, calls our /api/translate route,
 * and patches name_fr / name_ar / description_fr / description_ar in one click.
 *
 * Registered only for the `product` schema type — see sanity.config.tsx.
 */
export const translateAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published, type, id, onComplete } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (type !== "product") return null;

  const doc: any = draft || published;
  if (!doc?.name) return null;

  return {
    label: isTranslating ? "Translating…" : error ? "Retry Translate" : "🌐 Auto-Translate",
    disabled: isTranslating,
    tone: error ? "critical" : "primary",
    onHandle: async () => {
      setIsTranslating(true);
      setError(null);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: doc.name, description: doc.description }),
        });

        if (!res.ok) throw new Error("Translation service unavailable");
        const data = await res.json();

        // Editing always happens on the draft — make sure one exists, then patch it.
        const draftId = id.startsWith("drafts.") ? id : `drafts.${id}`;

        await client.createIfNotExists({ _id: draftId, _type: "product" });
        await client
          .patch(draftId)
          .set({
            name_fr: data.name_fr || doc.name_fr || "",
            name_ar: data.name_ar || doc.name_ar || "",
            description_fr: data.description_fr || doc.description_fr || "",
            description_ar: data.description_ar || doc.description_ar || "",
          })
          .commit();
      } catch (e: any) {
        console.error("Auto-translate failed:", e);
        setError(e.message || "Failed");
      } finally {
        setIsTranslating(false);
        onComplete();
      }
    },
  };
};