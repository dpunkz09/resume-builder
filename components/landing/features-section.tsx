const features = [
  {
    title: "AI suggestions",
    description:
      "Rewrite weak bullet points, generate a summary, and get an analysis of your whole resume with specific things to fix.",
  },
  {
    title: "ATS-friendly templates",
    description: "Classic, Modern, Minimal and ATS layouts. Switch between them without re-entering anything.",
  },
  {
    title: "Live preview",
    description: "Every edit shows up on the page immediately, and the PDF matches what you see.",
  },
  {
    title: "Customization",
    description:
      "Change colors, fonts, spacing and margins until the page fits your content without looking crowded.",
  },
  {
    title: "PDF export",
    description: "Download in A4, US Letter or Folio, ready to attach to an application.",
  },
  {
    title: "Privacy",
    description: "We never share your information, and you can delete your account and data at any time.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-zinc-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Everything you need to finish your resume
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
          Writing, layout and export in one place, so you spend your time on the content.
        </p>

        <dl className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="border-t border-zinc-900 pt-5">
              <dt className="text-lg font-semibold text-zinc-900">{feature.title}</dt>
              <dd className="mt-2 leading-relaxed text-zinc-600">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
