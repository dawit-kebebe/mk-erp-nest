import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphCycleDetectorService {

    /**
     * Checks for a cycle within a collection of generic nodes based on parent-child relationships.
     *
     * @template T The type of the nodes in the collection.
     * @param nodes The complete list of nodes to check.
     * @param getId A function that returns the unique ID (string) of a node.
     * @param getParentId A function that returns the parent ID (string or undefined/null) of a node.
     * @returns True if a cycle is detected, false otherwise.
     */
    hasCycle<T>(
        nodes: T[],
        getId: (node: T) => string,
        getParentId: (node: T) => string | undefined | null
    ): boolean {
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const adjList = new Map<string, string[]>();

        for (const node of nodes) {
            adjList.set(getId(node), []);
        }

        for (const node of nodes) {
            const parentId = getParentId(node);
            const nodeId = getId(node);

            if (parentId) {
                if (!adjList.has(parentId)) {
                    continue;
                }
                adjList.get(parentId)!.push(nodeId);
            }
        }

        const dfs = (uId: string): boolean => {
            visited.add(uId);
            recursionStack.add(uId);

            const children = adjList.get(uId) || [];

            for (const vId of children) {
                if (!visited.has(vId)) {
                    if (dfs(vId)) {
                        return true;
                    }
                } else if (recursionStack.has(vId)) {
                    return true;
                }
            }

            recursionStack.delete(uId);
            return false;
        };

        for (const node of nodes) {
            const nodeId = getId(node);
            if (!visited.has(nodeId)) {
                if (dfs(nodeId)) {
                    return true;
                }
            }
        }

        return false;
    }
}
