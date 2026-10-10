import { Link, useParams } from 'react-router-dom';
import { Lock, SearchX } from 'lucide-react';
import { BlockList, PortalSectionHeader } from '../../components/portal';
import { Button, Card, IconTile } from '../../components/ui';
import { getDashboard, getSection } from '../../data/portalDashboards';
import { hasPermission, permissionLabels } from '../../data/portalAccess';
import { schoolInfo } from '../../data/school';
import { useSeo } from '../../hooks/useSeo';
import { useAppSelector } from '../../store/hooks';

/**
 * One page for every dashboard section, for every role.
 *
 * The section id comes from the URL (`/portal/student/timetable`); with no id it
 * falls back to the overview. The content is looked up in `data/portalDashboards`
 * and rendered as a stack of blocks, so this single component serves the
 * twenty-plus pages across all four portals.
 *
 * Two RBAC outcomes are handled here rather than by hiding links:
 *  - a section id that does not belong to this role renders "not in your portal";
 *  - a section the role lacks permission for renders "no access", naming the
 *    permission. Both matter because a URL can always be typed by hand.
 */
export function PortalSectionPage() {
  const role = useAppSelector((state) => state.auth.role);
  const { sectionId } = useParams<{ sectionId?: string }>();
  const id = sectionId ?? 'overview';

  const dashboard = role ? getDashboard(role) : undefined;
  const section = role ? getSection(role, id) : undefined;

  useSeo({
    title: section
      ? `${section.title} | ${dashboard?.portalName ?? 'Portal'} | ${schoolInfo.name}`
      : `Portal | ${schoolInfo.name}`,
    description: section?.description ?? 'A preview of a school portal dashboard.',
    path: role ? `/portal/${role}/${id}` : '/portal',
    // The portals are a demo and carry only sample data; keep them out of search.
    noIndex: true,
  });

  if (!role || !dashboard) return null;

  const backToOverview = (
    <Button variant="outline" size="sm" asChild>
      <Link to={`/portal/${role}`}>Back to overview</Link>
    </Button>
  );

  if (!section) {
    return (
      <CenterPanel
        icon={<SearchX className="h-6 w-6" aria-hidden="true" />}
        title="This page is not part of your portal"
        description={`The ${dashboard.portalName} does not have a "${id}" page. Use the navigation to reach the pages available to you.`}
      >
        {backToOverview}
      </CenterPanel>
    );
  }

  if (!hasPermission(role, section.permission)) {
    return (
      <CenterPanel
        icon={<Lock className="h-6 w-6" aria-hidden="true" />}
        title="You do not have access to this page"
        description={`The ${dashboard.portalName} does not grant the "${permissionLabels[section.permission]}" permission needed for this page.`}
      >
        {backToOverview}
      </CenterPanel>
    );
  }

  return (
    <div>
      <PortalSectionHeader title={section.title} description={section.description} />
      <BlockList blocks={section.blocks} />
    </div>
  );
}

function CenterPanel({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding="lg" className="mx-auto max-w-xl text-center">
      <div className="flex flex-col items-center">
        <IconTile tone="gold" size="lg">
          {icon}
        </IconTile>
        <h1 className="mt-5 font-display text-xl font-semibold text-navy">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </Card>
  );
}
