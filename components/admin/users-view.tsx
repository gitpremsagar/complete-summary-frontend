"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRoundIcon, Loader2Icon, LogOutIcon, MoreHorizontalIcon, SearchIcon, ShieldMinusIcon, ShieldPlusIcon, UserCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import {
  DangerConfirmDialog,
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
  PageBody,
  PageHeader,
  Pagination,
  formatDate,
} from "@/components/admin/admin-ui";
import { useAuth } from "@/components/providers/auth-provider";
import { adminApi } from "@/lib/admin-api";
import type { AdminRole, AdminUser } from "@/lib/admin-types";

const LIMIT = 20;

export function UsersView() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<AdminRole | "ALL">("ALL");
  const [status, setStatus] = useState<"active" | "suspended">("active");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminApi
      .users({ q: query, role: role === "ALL" ? undefined : role, status, page, limit: LIMIT })
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load users"));
  }, [query, role, status, page]);

  // Deferring the fetch keeps the effect from setting state synchronously during render/commit.
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const refresh = () => load();

  async function changeRole(user: AdminUser, next: AdminRole) {
    setBusyId(user.id);
    try {
      await adminApi.updateUser(user.id, { role: next });
      toast.success(`${user.name} is now ${next === "ADMIN" ? "an admin" : "a regular user"}`);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change the role");
    } finally {
      setBusyId(null);
    }
  }

  async function revokeSessions(user: AdminUser) {
    setBusyId(user.id);
    try {
      const { revoked } = await adminApi.revokeSessions(user.id);
      toast.success(`Signed ${user.name} out${revoked ? ` of ${revoked} session${revoked === 1 ? "" : "s"}` : ""}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not revoke sessions");
    } finally {
      setBusyId(null);
    }
  }

  async function restore(user: AdminUser) {
    setBusyId(user.id);
    try {
      await adminApi.restoreUser(user.id);
      toast.success(`${user.name} can sign in again`);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not restore the user");
    } finally {
      setBusyId(null);
    }
  }

  const rows = useMemo(() => users ?? [], [users]);

  return (
    <>
      <AdminTopbar title="Users" />
      <PageBody>
        <PageHeader title="Users" description="Everyone with an account. Search, change roles, or suspend access." />

        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={status}
            onValueChange={(value) => {
              setStatus(value as typeof status);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              className="pl-8"
              type="search"
            />
          </div>
          <Select
            value={role}
            onValueChange={(value) => {
              setRole(value as typeof role);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="USER">Users</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="pt-4">
            {error ? (
              <ErrorBlock message={error} onRetry={refresh} />
            ) : !users ? (
              <LoadingBlock />
            ) : rows.length === 0 ? (
              <EmptyBlock
                title={status === "suspended" ? "No suspended users" : "No users found"}
                description={query ? "Try a different search." : undefined}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead>{status === "suspended" ? "Suspended" : "Joined"}</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((user) => (
                    <TableRow key={user.id} className={user.deletedAt ? "opacity-70" : undefined}>
                      <TableCell className="font-medium">
                        {user.name}
                        {user.id === me?.id && (
                          <Badge variant="outline" className="ml-2">
                            You
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{user.commentCount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(status === "suspended" ? user.deletedAt : user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" disabled={busyId === user.id} aria-label={`Actions for ${user.name}`}>
                              {busyId === user.id ? <Loader2Icon className="animate-spin" /> : <MoreHorizontalIcon />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.deletedAt ? (
                              <DropdownMenuItem onSelect={() => void restore(user)}>
                                <UserCheckIcon />
                                Restore access
                              </DropdownMenuItem>
                            ) : (
                              <>
                                {user.role === "USER" ? (
                                  <DropdownMenuItem onSelect={() => void changeRole(user, "ADMIN")}>
                                    <ShieldPlusIcon />
                                    Make admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    disabled={user.id === me?.id}
                                    onSelect={() => void changeRole(user, "USER")}
                                  >
                                    <ShieldMinusIcon />
                                    Remove admin
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onSelect={() => setResetTarget(user)}>
                                  <KeyRoundIcon />
                                  Reset password
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => void revokeSessions(user)}>
                                  <LogOutIcon />
                                  Sign out everywhere
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  disabled={user.id === me?.id}
                                  onSelect={() => setSuspendTarget(user)}
                                >
                                  <ShieldMinusIcon />
                                  Suspend user
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {users && total > 0 && <div className="mt-4"><Pagination page={page} limit={LIMIT} total={total} onPage={setPage} /></div>}
          </CardContent>
        </Card>
      </PageBody>

      <DangerConfirmDialog
        open={suspendTarget !== null}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title="Suspend this user?"
        description={
          <>
            <strong>{suspendTarget?.name}</strong> ({suspendTarget?.email}) will be signed out immediately and blocked
            from signing in. Their comments stay in place and you can restore access later.
          </>
        }
        confirmWord={suspendTarget?.email ?? ""}
        confirmLabel="Suspend user"
        onConfirm={async () => {
          if (!suspendTarget) return;
          try {
            await adminApi.suspendUser(suspendTarget.id);
            toast.success(`${suspendTarget.name} was suspended`);
            setSuspendTarget(null);
            refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not suspend the user");
          }
        }}
      />

      <ResetPasswordDialog user={resetTarget} onOpenChange={(open) => !open && setResetTarget(null)} />
    </>
  );
}

function ResetPasswordDialog({ user, onOpenChange }: { user: AdminUser | null; onOpenChange: (open: boolean) => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!user) return;
    setBusy(true);
    try {
      await adminApi.resetPassword(user.id, password);
      toast.success(`Password updated for ${user.name}. All their sessions were signed out.`);
      setPassword("");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset the password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open) setPassword("");
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Set a new password for {user?.name} ({user?.email}). Their existing sessions will be signed out.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          value={password}
          autoComplete="new-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={password.length < 8 || busy} onClick={() => void submit()}>
            {busy && <Loader2Icon className="animate-spin" />}
            Update password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
