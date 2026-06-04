import type { Route } from './+types/home';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsHeader } from '@/components/docs-header';
import { SectionSwitcher } from '@/components/section-switcher';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { getPageMarkdownUrl, source } from '@/lib/source';
import browserCollections from 'collections/browser';
import { baseOptions } from '@/lib/layout.shared';
import { gitConfig } from '@/lib/shared';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { getPageImagePath } from '@/lib/og';
import { useMDXComponents } from '@/components/mdx';
import type { Folder } from 'fumadocs-core/page-tree';
import type { ShouldRevalidateFunction } from 'react-router';
import { redirect, useLocation } from 'react-router';

export const shouldRevalidate: ShouldRevalidateFunction = () => true;

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = (params['*'] ?? '').split('/').filter((v) => v.length > 0);
  if (slugs.length === 0) return redirect('/manual/introduction');

  const page = source.getPage(slugs);
  if (!page) throw new Response('Not found', { status: 404 });

  const fullTree = source.getPageTree();
  const section = slugs[0];

  let tree = fullTree;
  if (section) {
    const folder = fullTree.children.find(
      (node): node is Folder =>
        node.type === 'folder' &&
        node.children.some(
          (child) => child.type === 'page' && child.url.startsWith(`/${section}/`),
        ),
    );
    if (folder) tree = { ...fullTree, children: folder.children };
  }

  return {
    path: page.path,
    markdownUrl: getPageMarkdownUrl(page).url,
    pageTree: await source.serializePageTree(tree),
    imagePath: getPageImagePath(slugs),
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: Mdx },
    // you can define props for the `<Content />` component
    {
      markdownUrl,
      path,
      imagePath,
    }: {
      markdownUrl: string;
      path: string;
      imagePath: string;
    },
  ) {
    return (
      <DocsPage toc={toc}>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:image" content={imagePath} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/${path}`}
          />
        </div>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree, imagePath, markdownUrl } = useFumadocsLoader(loaderData);
  const { pathname } = useLocation();
  const section = pathname.split('/').filter(Boolean)[0] ?? 'root';

  return (
    <DocsLayout
      key={section}
      {...baseOptions()}
      tree={pageTree}
      tabs={false}
      slots={{ header: DocsHeader }}
      sidebar={{ banner: <SectionSwitcher /> }}
    >
      {clientLoader.useContent(path, { markdownUrl, path, imagePath })}
    </DocsLayout>
  );
}
