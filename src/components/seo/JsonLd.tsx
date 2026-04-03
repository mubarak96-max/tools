interface JsonLdProps {
  data: string;
}

export default function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;
}
