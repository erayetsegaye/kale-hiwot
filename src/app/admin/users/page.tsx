import { ShieldCheck, UserCog } from 'lucide-react';
import { RoleSelect } from '@/components/domain/role-select';
import { Avatar } from '@/components/ui/avatar';
import { Badge, RoleBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Table, TableWrap, Td, Th, Tr } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listProfiles } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';

export const metadata = { title: 'Users & roles' };

export default async function AdminUsersPage() {
  const t = await getT();
  const f = await getFormat();
  const profiles = await listProfiles();
  const counts = {
    admin: profiles.filter((p) => p.role === 'admin').length,
    teacher: profiles.filter((p) => p.role === 'teacher').length,
    parent: profiles.filter((p) => p.role === 'parent').length,
  };

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.users.eyebrow')}
        title={t('pages.admin.users.title')}
        description={t('pages.admin.users.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {(['admin', 'teacher', 'parent'] as const).map((role) => (
          <Card key={role} className="p-5">
            <div className="flex items-center justify-between">
              <RoleBadge role={role} />
              <UserCog className="size-4 text-faint" />
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">
              {counts[role]}
            </p>
            <p className="text-[0.75rem] text-muted">
              {role === 'admin'
                ? 'Full management access'
                : role === 'teacher'
                  ? 'Assigned classes only'
                  : 'Own children only'}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="All accounts"
          description="Role changes take effect immediately and are recorded in the audit log."
          icon={<ShieldCheck className="size-[1.1rem]" />}
        />
        <CardBody className="px-0 pt-3 pb-0 sm:px-0">
          <TableWrap className="shadow-none">
            <Table>
              <thead>
                <tr>
                  <Th>Person</Th>
                  <Th>Current role</Th>
                  <Th>Last active</Th>
                  <Th>Member since</Th>
                  <Th>Change role</Th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <Tr key={profile.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={profile.fullName} src={profile.avatarUrl} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">
                            {profile.fullName}
                          </p>
                          <p className="truncate text-[0.75rem] text-muted">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <RoleBadge role={profile.role} />
                        {!profile.isActive ? <Badge tone="berry">Suspended</Badge> : null}
                      </div>
                    </Td>
                    <Td className="text-[0.8125rem] text-muted">
                      {profile.lastSeenAt ? f.ago(profile.lastSeenAt) : '—'}
                    </Td>
                    <Td className="text-[0.8125rem] text-muted">
                      {f.date(profile.createdAt)}
                    </Td>
                    <Td>
                      <RoleSelect
                        userId={profile.id}
                        userName={profile.fullName}
                        role={profile.role}
                      />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        </CardBody>
      </Card>
    </div>
  );
}
