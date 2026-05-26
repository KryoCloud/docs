import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div
          className="cryo-glass cryo-glow flex flex-col items-center gap-4 px-10 py-12"
          style={{ maxWidth: '32rem' }}
        >
          <span
            style={{
              fontSize: '4rem',
              fontWeight: 700,
              lineHeight: 1,
              backgroundImage: 'var(--cryo-gradient-primary)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            404
          </span>
          <h1 style={{ color: 'var(--cryo-text)', fontSize: '1.5rem', fontWeight: 600 }}>
            Page frozen out of reach
          </h1>
          <p style={{ color: 'var(--cryo-text-soft)' }}>
            We could not locate the page you were looking for. It may have been moved,
            renamed, or has not been documented yet.
          </p>
          <Link
            to="/"
            style={{
              marginTop: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: 'var(--cryo-radius-md)',
              background: 'var(--cryo-gradient-primary)',
              color: 'var(--cryo-on-primary)',
              fontWeight: 600,
              boxShadow: 'var(--cryo-shadow-glow)',
              transition: 'transform var(--cryo-transition-fast)',
            }}
          >
            Back to documentation
          </Link>
        </div>
      </main>
    </HomeLayout>
  );
}
