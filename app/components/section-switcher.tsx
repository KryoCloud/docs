'use client';

import { useLocation, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const sections = [
  { id: 'manual', label: 'Manual', description: 'User documentation', url: '/manual/introduction' },
  { id: 'development', label: 'Development', description: 'Developer API & SDK', url: '/development/introduction' },
  { id: 'addons', label: 'Addons', description: 'Plugins & extensions', url: '/addons/introduction' },
];

export function SectionSwitcher() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = sections.find((s) => pathname.startsWith(`/${s.id}`)) ?? sections[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border"
        style={{
          background: 'var(--cryo-surface-alt)',
          borderColor: open ? 'var(--cryo-primary)' : 'var(--cryo-border)',
          color: 'var(--cryo-text)',
          boxShadow: open ? '0 0 0 2px rgba(var(--cryo-primary-rgb), 0.15)' : 'none',
          transition: 'border-color 120ms ease, box-shadow 120ms ease',
        }}
      >
        <span className="flex-1 text-start">{current.label}</span>
        <ChevronDown
          className="size-3.5 shrink-0 transition-transform duration-150"
          style={{
            color: 'var(--cryo-text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute left-3 right-3 mt-1.5 z-50 rounded-lg border overflow-hidden"
          style={{
            background: 'var(--cryo-surface)',
            borderColor: 'var(--cryo-border)',
            boxShadow: 'var(--cryo-shadow-md)',
          }}
        >
          {sections.map((section) => {
            const isActive = section.id === current.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  navigate(section.url);
                  setOpen(false);
                }}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 text-start transition-colors"
                style={{
                  background: isActive ? 'rgba(var(--cryo-primary-rgb), 0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = 'var(--cryo-frost)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-none mb-0.5"
                    style={{ color: isActive ? 'var(--cryo-primary)' : 'var(--cryo-text)' }}
                  >
                    {section.label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--cryo-text-muted)' }}>
                    {section.description}
                  </p>
                </div>
                {isActive && (
                  <Check className="size-3.5 shrink-0 mt-0.5" style={{ color: 'var(--cryo-primary)' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
