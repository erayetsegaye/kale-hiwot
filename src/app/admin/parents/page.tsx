import { Mail, Phone, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableWrap, Td, Th, Tr } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listChildren, listGuardians } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Parents & guardians' };

export default async function AdminParentsPage() {
  const t = await getT();
  const [guardians, children] = await Promise.all([listGuardians(), listChildren()]);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.parents.eyebrow')}
        title={t('pages.admin.parents.title')}
        description={t('pages.admin.parents.description')}
        actions={<Button variant="outline">{t('common.export')}</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[0.8125rem] text-muted">Registered guardians</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-ink">
            {guardians.length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[0.8125rem] text-muted">Verified identities</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-ink">
            {guardians.filter((g) => g.verified).length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[0.8125rem] text-muted">Children linked</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-ink">
            {children.length}
          </p>
        </Card>
      </div>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Guardian</Th>
              <Th>Relationship</Th>
              <Th>Children</Th>
              <Th>Contact</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {guardians.map((guardian) => {
              const linked = children.filter((child) =>
                child.guardianIds.includes(guardian.id),
              );
              return (
                <Tr key={guardian.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={guardian.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {guardian.fullName}
                        </p>
                        <p className="truncate text-[0.75rem] text-muted">
                          {guardian.address ?? '—'}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-[0.8125rem] text-muted">{guardian.relationship}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {linked.length ? (
                        linked.map((child) => (
                          <Badge key={child.id} tone="neutral">
                            {child.fullName}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[0.8125rem] text-faint">None yet</span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <div className="space-y-1 text-[0.75rem] text-muted">
                      <p className="inline-flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {guardian.email}
                      </p>
                      <p className="inline-flex items-center gap-1.5">
                        <Phone className="size-3.5" />
                        {guardian.phone ?? '—'}
                      </p>
                    </div>
                  </Td>
                  <Td>
                    {guardian.verified ? (
                      <Badge tone="brand" icon={<ShieldCheck className="size-3" />}>
                        Verified
                      </Badge>
                    ) : (
                      <Badge tone="sun">Awaiting verification</Badge>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrap>
    </div>
  );
}
