import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useData } from '../state/data';
import SectionHeader from '../components/SectionHeader';
import DataBadge from '../components/DataBadge';
import { EmptyState, LoadingState } from '../components/States';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const Documentacion = () => {
  const { data, loading, error } = useData();

  const headings = useMemo(() => {
    if (!data?.documentacion) return [];
    return data.documentacion
      .split('\n')
      .filter((line) => line.startsWith('#'))
      .map((line) => {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+/, '').trim();
        return { level, text, id: slugify(text) };
      })
      .filter((heading) => heading.level <= 3);
  }, [data]);

  if (loading) return <LoadingState label="Cargando documentacion..." />;
  if (error || !data) return <EmptyState label={error || 'Datos no disponibles'} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Documentacion"
        subtitle="DOCUMENTACION.md renderizada"
        actions={<DataBadge source="DOCUMENTACION.md" />}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Indice</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`hover:text-slate-900 ${heading.level === 3 ? 'pl-4 text-xs' : ''}`}
              >
                {heading.text}
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  id={slugify(String(props.children))}
                  className="mt-6 text-2xl font-semibold text-slate-900"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  id={slugify(String(props.children))}
                  className="mt-6 text-xl font-semibold text-slate-900"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  id={slugify(String(props.children))}
                  className="mt-5 text-lg font-semibold text-slate-900"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mt-3 text-sm leading-relaxed text-slate-600" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code
                  className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700"
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-white" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="mt-4 border-l-4 border-slate-900 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600" {...props} />
              ),
            }}
          >
            {data.documentacion}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Documentacion;
