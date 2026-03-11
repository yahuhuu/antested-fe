import { useState, useEffect } from "react";
import {
  useUserStore,
  User,
} from "@/features/settings/users/store/useUserStore";
import {
  useGroupStore,
  Group,
} from "@/features/settings/users/store/useGroupStore";
import {
  useRoleStore,
  Role,
} from "@/features/settings/users/store/useRoleStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Plus,
  Trash2,
  MoreHorizontal,
  Edit,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Users,
  Lock,
  Power,
  PowerOff,
  Eye,
  Loader2,
} from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { UserModal } from "@/features/settings/users/components/UserModal";
import { GroupModal } from "@/features/settings/users/components/GroupModal";
import { RoleModal } from "@/features/settings/users/components/RoleModal";
import { UserSidePanel } from "@/features/settings/users/components/UserSidePanel";
import { GroupSidePanel } from "@/features/settings/users/components/GroupSidePanel";
import { RoleSidePanel } from "@/features/settings/users/components/RoleSidePanel";

export function SettingsUsersList() {
  const {
    users,
    isLoading: isLoadingUsers,
    fetchUsers,
    deleteUser,
    toggleUserStatus,
  } = useUserStore();
  const {
    groups,
    isLoading: isLoadingGroups,
    fetchGroups,
    deleteGroup,
  } = useGroupStore();
  const {
    roles,
    isLoading: isLoadingRoles,
    fetchRoles,
    deleteRole,
  } = useRoleStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "groups" | "roles">(
    "users",
  );

  useEffect(() => {
    fetchUsers();
    fetchGroups();
    fetchRoles();
  }, [fetchUsers, fetchGroups, fetchRoles]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | Group | Role | null>(
    null,
  );
  const [deleteType, setDeleteType] = useState<"user" | "group" | "role">(
    "user",
  );

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Group modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);

  // Role modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const currentDataLength =
    activeTab === "users"
      ? filteredUsers.length
      : activeTab === "groups"
        ? filteredGroups.length
        : filteredRoles.length;
  const totalPages = Math.ceil(currentDataLength / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage,
  );
  const paginatedGroups = filteredGroups.slice(
    startIndex,
    startIndex + rowsPerPage,
  );
  const paginatedRoles = filteredRoles.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === "users") {
      if (e.target.checked) {
        setSelectedUsers(paginatedUsers.map((u) => u.id));
      } else {
        setSelectedUsers([]);
      }
    } else if (activeTab === "groups") {
      if (e.target.checked) {
        setSelectedGroups(paginatedGroups.map((g) => g.id));
      } else {
        setSelectedGroups([]);
      }
    } else if (activeTab === "roles") {
      if (e.target.checked) {
        setSelectedRoles(paginatedRoles.map((r) => r.id));
      } else {
        setSelectedRoles([]);
      }
    }
  };

  const handleSelectItem = (id: string) => {
    if (activeTab === "users") {
      if (selectedUsers.includes(id)) {
        setSelectedUsers(selectedUsers.filter((itemId) => itemId !== id));
      } else {
        setSelectedUsers([...selectedUsers, id]);
      }
    } else if (activeTab === "groups") {
      if (selectedGroups.includes(id)) {
        setSelectedGroups(selectedGroups.filter((itemId) => itemId !== id));
      } else {
        setSelectedGroups([...selectedGroups, id]);
      }
    } else if (activeTab === "roles") {
      if (selectedRoles.includes(id)) {
        setSelectedRoles(selectedRoles.filter((itemId) => itemId !== id));
      } else {
        setSelectedRoles([...selectedRoles, id]);
      }
    }
  };

  const handleDeleteSelectedClick = () => {
    setItemToDelete(null);
    setDeleteType(
      activeTab === "users"
        ? "user"
        : activeTab === "groups"
          ? "group"
          : "role",
    );
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSingleClick = (
    item: User | Group | Role,
    type: "user" | "group" | "role",
  ) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleConfirmDelete = () => {
    if (deleteType === "user") {
      if (itemToDelete) {
        deleteUser(itemToDelete.id);
        setSelectedUsers(selectedUsers.filter((id) => id !== itemToDelete.id));
      } else {
        selectedUsers.forEach((id) => deleteUser(id));
        setSelectedUsers([]);
      }
    } else if (deleteType === "group") {
      if (itemToDelete) {
        deleteGroup(itemToDelete.id);
        setSelectedGroups(
          selectedGroups.filter((id) => id !== itemToDelete.id),
        );
      } else {
        selectedGroups.forEach((id) => deleteGroup(id));
        setSelectedGroups([]);
      }
    } else if (deleteType === "role") {
      if (itemToDelete) {
        deleteRole(itemToDelete.id);
        setSelectedRoles(selectedRoles.filter((id) => id !== itemToDelete.id));
      } else {
        selectedRoles.forEach((id) => deleteRole(id));
        setSelectedRoles([]);
      }
    }

    // Adjust pagination if needed
    const remainingItems =
      activeTab === "users"
        ? filteredUsers.length - (itemToDelete ? 1 : selectedUsers.length)
        : activeTab === "groups"
          ? filteredGroups.length - (itemToDelete ? 1 : selectedGroups.length)
          : filteredRoles.length - (itemToDelete ? 1 : selectedRoles.length);

    if (currentPage > Math.ceil(remainingItems / rowsPerPage)) {
      setCurrentPage(Math.max(1, Math.ceil(remainingItems / rowsPerPage)));
    }

    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
    setActiveDropdown(null);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setActiveDropdown(null);
  };

  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
    setActiveDropdown(null);
  };

  const handleAddRole = () => {
    setEditingRole(undefined);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
    setActiveDropdown(null);
  };

  const handleToggleStatus = (id: string) => {
    toggleUserStatus(id);
    setActiveDropdown(null);
  };

  if (isLoadingUsers || isLoadingGroups || isLoadingRoles) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Users & Roles
        </h1>
      </div>

      <div className="flex border-b border-border shrink-0">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "users" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"}`}
          onClick={() => setActiveTab("users")}
        >
          <UserIcon className="h-4 w-4" />
          Users
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "groups" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"}`}
          onClick={() => setActiveTab("groups")}
        >
          <Users className="h-4 w-4" />
          Groups
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "roles" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"}`}
          onClick={() => setActiveTab("roles")}
        >
          <Lock className="h-4 w-4" />
          Roles
        </button>
      </div>

      {activeTab === "users" && (
        <>
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search name or email..."
                  className="pl-8 bg-surface border-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <select className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none">
                <option value="all">Status: All</option>
                <option value="active">Status: Active</option>
                <option value="inactive">Status: Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelectedClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedUsers.length})
                </Button>
              )}
              <Button
                onClick={handleAddUser}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-xl border border-border bg-background overflow-hidden">
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-border bg-surface-hover text-text uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="rounded border-white/30 text-primary focus:ring-white bg-white/10"
                          checked={
                            selectedUsers.length === paginatedUsers.length &&
                            paginatedUsers.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Groups</th>
                    <th className="px-4 py-3 text-center">Projects</th>
                    <th className="px-4 py-3">Last Active</th>
                    <th className="px-4 py-3 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-text-muted"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-surface-hover transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary bg-background"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectItem(user.id)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-text">
                                {user.name}
                              </span>
                              <span className="text-xs text-text-muted">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text">{user.role}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              user.status === "Active" ? "success" : "secondary"
                            }
                            className="text-[10px] px-2 py-0.5"
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-text-muted">
                          {user.groups}
                        </td>
                        <td className="px-4 py-3 text-center text-text-muted">
                          {user.projects}
                        </td>
                        <td className="px-4 py-3 text-text-muted">
                          {user.lastActive}
                        </td>
                        <td className="px-4 py-3 text-center relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === user.id ? null : user.id,
                              )
                            }
                            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {activeDropdown === user.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div className="absolute right-8 top-8 z-50 w-36 rounded-md border border-border bg-surface shadow-lg py-1">
                                <button
                                  onClick={() => handleViewUser(user)}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View User
                                </button>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(user.id)}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  {user.status === "Active" ? (
                                    <>
                                      <PowerOff className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Power className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSingleClick(user, "user")
                                  }
                                  className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="shrink-0 flex items-center justify-between border-t border-border bg-surface-hover px-4 py-3 sm:px-6">
              <div className="hidden sm:block">
                <p className="text-xs text-text">
                  {filteredUsers.length === 0
                    ? "0 items"
                    : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} items`}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-text"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages || 1}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-12 rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-center text-text"
                  />
                </div>
                <div>
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage >= totalPages}
                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "groups" && (
        <>
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search groups..."
                  className="pl-8 bg-surface border-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedGroups.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelectedClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedGroups.length})
                </Button>
              )}
              <Button
                onClick={handleAddGroup}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-xl border border-border bg-background overflow-hidden">
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-border bg-surface-hover text-text uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="rounded border-white/30 text-primary focus:ring-white bg-white/10"
                          checked={
                            selectedGroups.length === paginatedGroups.length &&
                            paginatedGroups.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-center">Users</th>
                    <th className="px-4 py-3 text-center">Projects</th>
                    <th className="px-4 py-3 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {paginatedGroups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-text-muted"
                      >
                        No groups found.
                      </td>
                    </tr>
                  ) : (
                    paginatedGroups.map((group) => (
                      <tr
                        key={group.id}
                        className="group hover:bg-surface-hover transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary bg-background"
                              checked={selectedGroups.includes(group.id)}
                              onChange={() => handleSelectItem(group.id)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-text">
                            {group.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text">
                          {group.description}
                        </td>
                        <td className="px-4 py-3 text-center text-text-muted">
                          {group.users}
                        </td>
                        <td className="px-4 py-3 text-center text-text-muted">
                          {group.projects}
                        </td>
                        <td className="px-4 py-3 text-center relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === group.id ? null : group.id,
                              )
                            }
                            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {activeDropdown === group.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div className="absolute right-8 top-8 z-50 w-32 rounded-md border border-border bg-surface shadow-lg py-1">
                                <button
                                  onClick={() => {
                                    setViewingGroup(group);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditGroup(group)}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSingleClick(group, "group")
                                  }
                                  className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="shrink-0 flex items-center justify-between border-t border-border bg-surface-hover px-4 py-3 sm:px-6">
              <div className="hidden sm:block">
                <p className="text-xs text-text">
                  {filteredGroups.length === 0
                    ? "0 items"
                    : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredGroups.length)} of ${filteredGroups.length} items`}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-text"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages || 1}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-12 rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-center text-text"
                  />
                </div>
                <div>
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage >= totalPages}
                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "roles" && (
        <>
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search roles..."
                  className="pl-8 bg-surface border-border"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedRoles.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelectedClick}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedRoles.length})
                </Button>
              )}
              <Button
                onClick={handleAddRole}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-xl border border-border bg-background overflow-hidden">
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-border bg-surface-hover text-text uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="rounded border-white/30 text-primary focus:ring-white bg-white/10"
                          checked={
                            selectedRoles.length === paginatedRoles.length &&
                            paginatedRoles.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-center">Users</th>
                    <th className="px-4 py-3 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {paginatedRoles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-text-muted"
                      >
                        No roles found.
                      </td>
                    </tr>
                  ) : (
                    paginatedRoles.map((role) => (
                      <tr
                        key={role.id}
                        className="group hover:bg-surface-hover transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary bg-background"
                              checked={selectedRoles.includes(role.id)}
                              onChange={() => handleSelectItem(role.id)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-text">
                            {role.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text">
                          {role.description}
                        </td>
                        <td className="px-4 py-3 text-center text-text-muted">
                          {role.users}
                        </td>
                        <td className="px-4 py-3 text-center relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === role.id ? null : role.id,
                              )
                            }
                            className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {activeDropdown === role.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div className="absolute right-8 top-8 z-50 w-32 rounded-md border border-border bg-surface shadow-lg py-1">
                                <button
                                  onClick={() => {
                                    setViewingRole(role);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditRole(role)}
                                  className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSingleClick(role, "role")
                                  }
                                  className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="shrink-0 flex items-center justify-between border-t border-border bg-surface-hover px-4 py-3 sm:px-6">
              <div className="hidden sm:block">
                <p className="text-xs text-text">
                  {filteredRoles.length === 0
                    ? "0 items"
                    : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredRoles.length)} of ${filteredRoles.length} items`}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select
                    className="rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-text"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages || 1}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-12 rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-center text-text"
                  />
                </div>
                <div>
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage >= totalPages}
                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={editingUser}
      />

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        group={editingGroup}
      />

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={editingRole}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={
          itemToDelete
            ? `Delete ${deleteType === "user" ? "User" : deleteType === "group" ? "Group" : "Role"} ${itemToDelete.name}`
            : `Delete ${deleteType === "user" ? selectedUsers.length : deleteType === "group" ? selectedGroups.length : selectedRoles.length} ${deleteType === "user" ? "Users" : deleteType === "group" ? "Groups" : "Roles"}`
        }
        description={
          itemToDelete
            ? `Are you sure you want to delete ${deleteType === "user" ? "User" : deleteType === "group" ? "Group" : "Role"} ${itemToDelete.name}? This action cannot be undone.`
            : `Are you sure you want to delete these ${deleteType === "user" ? selectedUsers.length : deleteType === "group" ? selectedGroups.length : selectedRoles.length} ${deleteType === "user" ? "Users" : deleteType === "group" ? "Groups" : "Roles"}? This action cannot be undone.`
        }
      />

      <UserSidePanel
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        user={viewingUser}
      />

      <GroupSidePanel
        isOpen={!!viewingGroup}
        onClose={() => setViewingGroup(null)}
        group={viewingGroup}
      />

      <RoleSidePanel
        isOpen={!!viewingRole}
        onClose={() => setViewingRole(null)}
        role={viewingRole}
      />
    </div>
  );
}
