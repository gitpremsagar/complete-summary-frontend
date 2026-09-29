import type { ReactNode } from "react";

export function Section({
  id,
  title,
  variant,
  children,
}: {
  id: string;
  title: string;
  variant?: "checklist";
  children: ReactNode;
}) {
  return (
    <section id={id} className="cs-sec" data-section data-variant={variant} aria-labelledby={`${id}-title`}>
      <button type="button" className="cs-sec-head" data-section-toggle aria-expanded="true" aria-controls={`${id}-body`}>
        <span className="cs-sec-num" aria-hidden="true" />
        <h2 id={`${id}-title`}>{title}</h2>
        <span className="cs-sec-chev" aria-hidden="true">
          &#9662;
        </span>
      </button>
      <div id={`${id}-body`} className="cs-sec-body">
        {children}
      </div>
    </section>
  );
}

/** Highlighted takeaway. Start the children with a `<b>` label, e.g. `<KeyPoint><b>Definition</b>...</KeyPoint>`. */
export function KeyPoint({ children }: { children: ReactNode }) {
  return <div className="cs-key">{children}</div>;
}

/** Warning callout. Start the children with a `<b>` label. */
export function Warn({ children }: { children: ReactNode }) {
  return <div className="cs-warn">{children}</div>;
}

export function Quote({ cite, children }: { cite?: string; children: ReactNode }) {
  return (
    <blockquote className="cs-quote">
      {children}
      {cite && <cite>{cite}</cite>}
    </blockquote>
  );
}

/** Research study card. Children usually are an `<h4>` title followed by a `<dl>` of details. */
export function Study({ tag = "Study", children }: { tag?: string; children: ReactNode }) {
  return (
    <div className="cs-study">
      <span className="cs-study-tag">{tag}</span>
      {children}
    </div>
  );
}

export function Grid({ cols = 2, children }: { cols?: 2 | 3; children: ReactNode }) {
  return (
    <div className="cs-grid" data-cols={cols}>
      {children}
    </div>
  );
}

export function Box({ children }: { children: ReactNode }) {
  return <div className="cs-box">{children}</div>;
}

export function SimpleTable({ children }: { children: ReactNode }) {
  return (
    <div className="cs-table-wrap">
      <table className="cs-table">{children}</table>
    </div>
  );
}
