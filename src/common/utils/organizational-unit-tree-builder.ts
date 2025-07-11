import { OrganizationalUnit } from "@mk/database/entities/organizational-unit.entity";

export type TreeNode<T> = T & {
  children: TreeNode<T>[];
};

export function buildTree(
  nodes: OrganizationalUnit[]
): Map<string, TreeNode<OrganizationalUnit>> {
  const map = new Map<string, TreeNode<OrganizationalUnit>>();

  // Initialize all nodes with empty children
  nodes.forEach(n => map.set(n.id, { ...n, children: [] }));

  // Assign children to their parents
  nodes.forEach(n => {
    if (n.parentOrgId) {
      const parent = map.get(n.parentOrgId);
      const child = map.get(n.id);
      if (parent && child) parent.children.push(child);
    }
  });

  return map;
}

export function getSubTree(
  rootId: string,
  treeMap: Map<string, TreeNode<OrganizationalUnit>>
): TreeNode<OrganizationalUnit> | undefined {
  return treeMap.get(rootId);
}
