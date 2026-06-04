'use client';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { SidebarIcon } from 'lucide-react';

export function DocsHeader() {
  const { slots } = useDocsLayout();

  return (
    <header
      id="nd-subnav"
      className="[grid-area:header] sticky top-[var(--fd-docs-row-1,0px)] z-30 flex items-center gap-2 px-4 h-14"
    >
      {slots.sidebar && (
        <slots.sidebar.trigger
          className="p-2 rounded-md text-[var(--cryo-text-soft)] hover:text-[var(--cryo-text)] hover:bg-[var(--cryo-frost)] transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <SidebarIcon className="size-4" />
        </slots.sidebar.trigger>
      )}

      <div className="flex-1 flex justify-center">
        {slots.searchTrigger && (
          <slots.searchTrigger.full
            className="w-full max-w-xs sm:max-w-sm"
            style={{
              background: 'var(--cryo-surface-alt)',
              borderColor: 'var(--cryo-border)',
              color: 'var(--cryo-text-soft)',
            }}
          />
        )}
      </div>
    </header>
  );
}
