import * as arguebuf from "arg-services/arg_services/graph/v1/graph_pb";
import * as aif from "./aif";
import type { Edge } from "./edge";
import * as edge from "./edge";
import type { Graph } from "./graph";
import * as graph from "./graph";
import { init as initGraph } from "./graph";
import type { AtomNode, Node, SchemeNode } from "./node";
import * as node from "./node";
import { isAtom, isScheme } from "./node";

export { v1 as uuid } from "uuid";
export { init as initAnalyst } from "./analyst";
export type { Analyst } from "./analyst";
export { init as initEdge } from "./edge";
export type { Edge, EdgeData } from "./edge";
export { init as initGraph } from "./graph";
export type { Graph } from "./graph";
export {
  initAtom,
  initScheme,
  isAtom,
  isScheme,
  label as nodeLabel,
  schemeMap,
  SchemeType,
} from "./node";
export type {
  AtomData,
  AtomNode,
  Node,
  NodeData,
  Scheme,
  SchemeData,
  SchemeNode,
} from "./node";
export { init as initParticipant } from "./participant";
export type { Participant } from "./participant";
export { init as initReference } from "./reference";
export type { Reference } from "./reference";
export { init as initResource } from "./resource";
export type { Resource } from "./resource";
export { node, edge, graph };

export type OptionalElement = Element | undefined;
export type Element = AtomNode | SchemeNode | Edge;
export type Elements = Array<Element> | OptionalElement;
export type ElementType = "atom" | "scheme" | "edge" | "graph";

export interface State {
  nodes: Array<Node>;
  edges: Array<Edge>;
  graph: Graph;
}

export interface StateInitProps {
  nodes?: Array<Node>;
  edges?: Array<Edge>;
  graph?: Graph;
}

export function initState({ nodes, edges, graph }: StateInitProps): State {
  return {
    nodes: nodes ?? [],
    edges: edges ?? [],
    graph: graph ?? initGraph({}),
  };
}

export function toAif(obj: State): aif.Graph {
  return {
    nodes: obj.nodes.map((n) => node.toAif(n)),
    edges: obj.edges.map((e) => edge.toAif(e)),
    locutions: [],
  };
}

export function fromAif(obj: aif.Graph): State {
  const nodes = obj.nodes
    .map((n) => node.fromAif(n))
    .filter((n): n is Node => !!n);
  const nodeIds = new Set(nodes.map((node) => node.id));

  const edges = obj.edges
    .filter((e) => nodeIds.has(e.fromID) && nodeIds.has(e.toID))
    .map((e) => edge.fromAif(e));

  return initState({
    nodes,
    edges,
  });
}

export function toProtobuf(obj: State): arguebuf.Graph {
  return arguebuf.Graph.create({
    nodes: Object.fromEntries(obj.nodes.map((n) => [n.id, node.toProtobuf(n)])),
    edges: Object.fromEntries(obj.edges.map((e) => [e.id, edge.toProtobuf(e)])),
    ...graph.toProtobuf(obj.graph),
  });
}

export function fromProtobuf(obj: arguebuf.Graph): State {
  return {
    nodes: Object.entries(obj.nodes).map(([id, n]) => node.fromProtobuf(id, n)),
    edges: Object.entries(obj.edges).map(([id, e]) => edge.fromProtobuf(id, e)),
    graph: graph.fromProtobuf(obj),
  };
}

export const elemType = (elem?: OptionalElement): ElementType => {
  if (elem === undefined) {
    return "graph";
  } else if ("source" in elem && "target" in elem) {
    return "edge";
  } else if (isAtom(elem)) {
    return "atom";
  } else if (isScheme(elem)) {
    return "scheme";
  }

  return "graph";
};

export interface Selection {
  nodes: Array<SchemeNode | AtomNode>;
  edges: Array<Edge>;
}

export type SelectionType = ElementType | "multiple";

export const selectionType = (sel: Selection): SelectionType => {
  if (sel.nodes.length === 0 && sel.edges.length === 0) {
    return "graph";
  } else if (sel.nodes.length === 0 && sel.edges.length === 1) {
    return "edge";
  } else if (sel.nodes.length === 1 && sel.edges.length === 0) {
    const node = sel.nodes[0];

    if (isAtom(node)) {
      return "atom";
    } else {
      return "scheme";
    }
  }

  return "multiple";
};