import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className={`${dc.shell.section} pt-16 sm:pt-20 lg:pt-24`}>
          <EditableReveal>
            <p className={dc.type.eyebrow}>{pagesContent.about.badge}</p>
            <h1 className={`${dc.type.heroTitle} mt-5 max-w-4xl`}>About {SITE_CONFIG.name}</h1>
            <p className={`${dc.type.bodyLg} mt-6 max-w-3xl`}>{pagesContent.about.description}</p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
          <EditableReveal>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className={`${dc.surface.card} p-8 lg:p-10`}>
                <p className={dc.type.eyebrow}>Our story</p>
                <div className="mt-6 space-y-5">
                  {pagesContent.about.paragraphs.map((paragraph) => (
                    <p key={paragraph} className={dc.type.body}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className={`${dc.surface.soft} p-8 lg:p-10`}>
                <p className={dc.type.eyebrow}>What we care about</p>
                <p className={`${dc.type.subTitle} mt-5`}>A calmer library — considered entries, cited sources, and quiet layouts.</p>
              </div>
            </div>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
          <EditableReveal>
            <p className={dc.type.eyebrow}>Principles</p>
            <h2 className={`${dc.type.sectionTitle} mt-4 max-w-3xl`}>How we curate.</h2>
          </EditableReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pagesContent.about.values.map((value, index) => (
              <EditableReveal key={value.title} index={index}>
                <div className={`${dc.surface.card} h-full p-8`}>
                  <p className={dc.type.eyebrow}>0{index + 1}</p>
                  <h3 className={`${dc.type.subTitle} mt-5`}>{value.title}</h3>
                  <p className={`${dc.type.body} mt-4`}>{value.description}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
