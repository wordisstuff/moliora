import { googleServiceAccountAccessToken, requiredEnv } from '@/lib/googleServiceAccount';

const GTM_SCOPE = 'https://www.googleapis.com/auth/tagmanager.readonly';
const BASE = 'https://tagmanager.googleapis.com/tagmanager/v2';

async function gtmGet(path: string) {
  const token = await googleServiceAccountAccessToken([GTM_SCOPE]);
  const response = await fetch(`${BASE}/${path}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Google Tag Manager API failed (${response.status}): ${JSON.stringify(data)}`);
  return data;
}

function ids() {
  return {
    accountId: requiredEnv('GTM_ACCOUNT_ID'),
    containerId: requiredEnv('GTM_CONTAINER_ID'),
    workspaceId: process.env.GTM_WORKSPACE_ID || '',
  };
}

export async function gtmSnapshot() {
  const { accountId, containerId, workspaceId } = ids();
  const containerPath = `accounts/${accountId}/containers/${containerId}`;
  const workspaces = await gtmGet(`${containerPath}/workspaces`);

  const selectedWorkspaceId =
    workspaceId ||
    workspaces.workspace?.find((w: { name?: string }) => w.name === 'Default Workspace')?.workspaceId ||
    workspaces.workspace?.[0]?.workspaceId;

  if (!selectedWorkspaceId) {
    return { containerPath, workspaces, selectedWorkspace: null, tags: [], triggers: [], variables: [] };
  }

  const workspacePath = `${containerPath}/workspaces/${selectedWorkspaceId}`;
  const [tags, triggers, variables] = await Promise.all([
    gtmGet(`${workspacePath}/tags`),
    gtmGet(`${workspacePath}/triggers`),
    gtmGet(`${workspacePath}/variables`),
  ]);

  return {
    containerPath,
    selectedWorkspaceId,
    workspaces: workspaces.workspace || [],
    tags: tags.tag || [],
    triggers: triggers.trigger || [],
    variables: variables.variable || [],
  };
}
