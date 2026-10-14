import { ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge, RoleBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableWrap, Td, Th, Tr } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listAuditLog } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';

export const metadata = { title: 'Audit logs' };

const severityTone = {
  info: 'neutral',
  warning: 'sun',
  critical: 'berry',
} as const;

export default async function AdminAuditLogsPage() {
  const t = await getT();
  const f = await getFormat();
  const entries = await listAuditLog();

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.audit.eyebrow')}
        title={t('pages.admin.audit.title')}
        description={t('pages.admin.audit.description')}
        actions={<Button variant="outline">{t('common.export')}</Button>}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-brand-50 p-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-700 text-white">
          <ShieldCheck className="size-5" />
        </span>
        <p className="text-[0.8125rem] text-brand-800">
          Audit entries are written by the database and cannot be edited or deleted from
          the application.
        </p>
      </div>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Actor</Th>
              <Th>Action</Th>
              <Th>Target</Th>
              <Th>Detail</Th>
              <Th>Severity</Th>
              <Th>When</Th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <Tr key={entry.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={entry.actorName} size="xs" />
                    <div className="min-w-0">
                      <p className="truncate text-[0.8125rem] font-semibold text-ink">
                        {entry.actorName}
                      </p>
                      <RoleBadge role={entry.actorRole} />
                    </div>
                  </div>
                </Td>
                <Td>
                  <code className="rounded bg-canvas px-2 py-1 text-[0.75rem] font-semibold text-brand-800">
                    {entry.action}
                  </code>
                </Td>
                <Td className="text-[0.8125rem] font-medium text-ink">{entry.target}</Td>
                <Td className="text-[0.8125rem] text-muted">{entry.detail}</Td>
                <Td>
                  <Badge tone={severityTone[entry.severity]}>{entry.severity}</Badge>
                </Td>
                <Td className="text-[0.8125rem] whitespace-nowrap text-muted">
                  {f.ago(entry.createdAt)}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </div>
  );
}
