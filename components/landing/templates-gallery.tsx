type TemplateId = "classic" | "modern" | "minimal" | "ats";

const templates: { id: TemplateId; name: string; description: string; plan: "Free" | "Pro" }[] = [
  { id: "classic", name: "Classic", description: "Traditional and professional", plan: "Free" },
  { id: "modern", name: "Modern", description: "Clean and contemporary", plan: "Pro" },
  { id: "minimal", name: "Minimal", description: "Simple and elegant", plan: "Pro" },
  { id: "ats", name: "ATS", description: "Plain layout for applicant tracking systems", plan: "Free" },
];

function Bar({ w = "w-full", h = "h-1", tone = "bg-zinc-200" }: { w?: string; h?: string; tone?: string }) {
  return <div className={`${h} ${w} rounded-full ${tone}`} />;
}

function Lines({ rows = ["w-full", "w-11/12", "w-4/5"], tone }: { rows?: string[]; tone?: string }) {
  return (
    <div className="space-y-1.5">
      {rows.map((w, i) => (
        <Bar key={i} w={w} tone={tone} />
      ))}
    </div>
  );
}

function TemplatePreview({ id }: { id: TemplateId }) {
  if (id === "classic") {
    return (
      <div className="h-full p-5">
        <div className="mb-4 flex flex-col items-center gap-1.5 border-b border-zinc-300 pb-3">
          <Bar w="w-1/2" h="h-2.5" tone="bg-zinc-800" />
          <Bar w="w-1/3" tone="bg-zinc-300" />
        </div>
        {[0, 1, 2].map((s) => (
          <div key={s} className="mb-4">
            <div className="mb-1.5 border-b border-zinc-300 pb-1">
              <Bar w="w-1/4" h="h-1.5" tone="bg-zinc-700" />
            </div>
            <Lines />
          </div>
        ))}
      </div>
    );
  }

  if (id === "modern") {
    return (
      <div className="flex h-full">
        <div className="w-[34%] space-y-4 bg-indigo-600 p-3.5">
          <div className="h-9 w-9 rounded-full bg-white/30" />
          <Bar w="w-4/5" h="h-2" tone="bg-white" />
          <Lines rows={["w-full", "w-3/4", "w-5/6"]} tone="bg-white/40" />
          <Bar w="w-2/3" h="h-1.5" tone="bg-white/80" />
          <Lines rows={["w-3/4", "w-full"]} tone="bg-white/40" />
        </div>
        <div className="flex-1 space-y-5 p-3.5">
          <Bar w="w-2/3" h="h-2" tone="bg-zinc-800" />
          <div>
            <Bar w="w-1/3" h="h-1.5" tone="bg-indigo-600" />
            <div className="mt-2">
              <Lines />
            </div>
          </div>
          <div>
            <Bar w="w-1/3" h="h-1.5" tone="bg-indigo-600" />
            <div className="mt-2">
              <Lines rows={["w-full", "w-5/6", "w-full", "w-2/3"]} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "minimal") {
    return (
      <div className="h-full space-y-7 p-6">
        <div className="space-y-2">
          <Bar w="w-2/5" h="h-3" tone="bg-zinc-800" />
          <Bar w="w-1/4" tone="bg-zinc-300" />
        </div>
        {[0, 1].map((s) => (
          <div key={s} className="space-y-2">
            <Bar w="w-1/5" tone="bg-zinc-400" />
            <Lines rows={["w-full", "w-10/12", "w-3/4"]} tone="bg-zinc-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full space-y-3 p-5">
      <Bar w="w-2/5" h="h-2.5" tone="bg-zinc-900" />
      <Bar w="w-3/5" tone="bg-zinc-400" />
      {[0, 1, 2].map((s) => (
        <div key={s} className="space-y-1.5 pt-1">
          <Bar w="w-1/4" h="h-1.5" tone="bg-zinc-900" />
          <Lines rows={["w-full", "w-full", "w-11/12", "w-full"]} tone="bg-zinc-300" />
        </div>
      ))}
    </div>
  );
}

export function TemplatesGallery() {
  return (
    <section id="templates" className="border-t border-zinc-200 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Four layouts, one set of content
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
          Every template is built to be read by applicant tracking systems. Change layouts at any time
          and your content moves with you.
        </p>

        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <li key={template.id} className="group">
              <div className="aspect-[8.5/11] overflow-hidden rounded-md border border-zinc-200 bg-white transition-shadow duration-300 group-hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)] motion-reduce:transition-none">
                <TemplatePreview id={template.id} />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-medium text-zinc-900">{template.name}</h3>
                <span className="text-sm text-zinc-500">{template.plan}</span>
              </div>
              <p className="mt-0.5 text-sm text-zinc-600">{template.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
