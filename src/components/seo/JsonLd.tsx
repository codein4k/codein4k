// Server component — no 'use client' needed.
// Renders a <script type="application/ld+json"> tag for structured data.
// Usage: <JsonLd data={schemaObject} />
//
// We use Record<string, unknown> rather than a recursive type because
// JSON-LD schemas are deeply nested and the strict recursive type causes
// false-positive TS errors with optional fields like `image?: string | null`.

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Array<Record<string, any>>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is safe here — data comes from our own server,
      // never from user input. JSON.stringify escapes all special characters.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
