import type { User, Workspace, WorkspaceMember } from "@/types";

// Synthetic demo records. Never use real people's names or contact details here;
// emails use the reserved example.com domain.

export const demoUsers: User[] = [
  {
    id: "usr_demo01",
    name: "Demo Producer",
    email: "producer@example.com",
    createdAt: "2026-09-01T04:30:00.000Z",
  },
];

export const demoWorkspaces: Workspace[] = [
  {
    id: "wsp_demo01",
    name: "Continuity Demo Studio",
    ownerUserId: "usr_demo01",
    createdAt: "2026-09-01T04:30:00.000Z",
  },
];

export const demoWorkspaceMembers: WorkspaceMember[] = [
  {
    id: "wsm_demo01",
    workspaceId: "wsp_demo01",
    userId: "usr_demo01",
    role: "owner",
    status: "active",
    joinedAt: "2026-09-01T04:30:00.000Z",
  },
];
