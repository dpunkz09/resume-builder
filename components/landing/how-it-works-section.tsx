const steps = [
  {
    title: "Add your details",
    description:
      "Fill in your experience, education and skills. Stuck on a bullet point? Ask the AI to rewrite it.",
  },
  {
    title: "Choose a template",
    description:
      "Switch templates at any time and adjust colors, fonts and margins. The preview updates as you type.",
  },
  {
    title: "Download your PDF",
    description: "Export in A4, US Letter or Folio and send it with your application.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-zinc-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          From blank page to PDF in three steps
        </h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="text-sm font-medium text-indigo-600">Step {i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold text-zinc-900">{step.title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-zinc-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
