import { StateGraph } from "@langchain/langgraph";
import { StateSchema, type State } from "./state";

/**
 * Build a linear graph with node ids in `order`.
 * We keep typing ergonomic by allowing `order` as a literal tuple.
 */
export function buildLinearGraph<const T extends readonly string[]>(
  nodeMap: Record<T[number], (s: State) => Promise<Partial<State>>>,
  order: T
) {
  // v1 API: pass Zod schema
  const g = new StateGraph({ state: StateSchema });

  // register nodes
  for (const id of order) {
    const fn = nodeMap[id as T[number]];
    if (!fn) throw new Error(`Unknown node: ${id as string}`);
    g.addNode(id as any, async (s: State) => {
      const update = await fn(s);
      return update || {};
    });
  }

  // edges (cast `as any` to satisfy the strict literal types)
  g.addEdge("__start__", order[0] as any);
  for (let i = 0; i < order.length - 1; i++) {
    g.addEdge(order[i] as any, order[i + 1] as any);
  }
  g.addEdge(order[order.length - 1] as any, "__end__");

  return g.compile();
}
