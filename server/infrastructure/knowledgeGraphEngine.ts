// Feature 6: Knowledge Graph Engine (Relationship Network across Land Records)
import { GraphNode, GraphEdge } from './types.js';

export class KnowledgeGraphEngine {
  private static instance: KnowledgeGraphEngine;
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  private constructor() {
    this.seedGraph();
  }

  public static getInstance(): KnowledgeGraphEngine {
    if (!KnowledgeGraphEngine.instance) {
      KnowledgeGraphEngine.instance = new KnowledgeGraphEngine();
    }
    return KnowledgeGraphEngine.instance;
  }

  private seedGraph() {
    // Seed Nodes
    const sampleNodes: GraphNode[] = [
      { id: 'node-parcel-421', label: 'Parcel 44/2 (ULPIN: 27-521-00421)', type: 'Parcel', properties: { area: '1.84 Ha', village: 'Wagholi' } },
      { id: 'node-owner-1', label: 'Sunita Ramesh Kulkarni', type: 'Owner', properties: { aadharHash: 'eKYC-Verified', kycDate: '2024-02-12' } },
      { id: 'node-owner-legacy', label: 'Ramesh Narayan Kulkarni (Deceased)', type: 'Owner', properties: { relation: 'Late Father' } },
      { id: 'node-village-wagholi', label: 'Village Wagholi, Pune', type: 'Village', properties: { censusCode: '556123', totalParcels: 3840 } },
      { id: 'node-officer-talathi', label: 'Rajesh Patil (Talathi #42)', type: 'Officer', properties: { designation: 'Talathi Revenue Officer' } },
      { id: 'node-mutation-104', label: 'Mutation Order #MUT-2024-8812', type: 'Mutation', properties: { status: 'SANCTIONED', sanctionDate: '2024-04-18' } },
      { id: 'node-inspection-9', label: 'Geo-Drone SVAMITVA Survey #99', type: 'Inspection', properties: { flightDate: '2025-01-10', dgpsAccuracy: '2.4cm' } },
    ];

    sampleNodes.forEach((n) => this.nodes.set(n.id, n));

    // Seed Edges
    this.edges = [
      { id: 'e1', source: 'node-owner-1', target: 'node-parcel-421', relationship: 'OWNS', properties: { share: '100%', title: 'Clear' } },
      { id: 'e2', source: 'node-parcel-421', target: 'node-village-wagholi', relationship: 'LOCATED_IN' },
      { id: 'e3', source: 'node-owner-legacy', target: 'node-owner-1', relationship: 'TRANSFERRED_TO', properties: { mode: 'Inheritance Succession' } },
      { id: 'e4', source: 'node-officer-talathi', target: 'node-mutation-104', relationship: 'VERIFIED_BY' },
      { id: 'e5', source: 'node-mutation-104', target: 'node-parcel-421', relationship: 'RELATED_MUTATION' },
      { id: 'e6', source: 'node-inspection-9', target: 'node-parcel-421', relationship: 'INSPECTED_BY' },
    ];
  }

  public getFullGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  public getSubGraphForEntity(entityId: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const matchedEdges = this.edges.filter(
      (e) => e.source === entityId || e.target === entityId
    );
    const nodeIds = new Set<string>();
    nodeIds.add(entityId);
    matchedEdges.forEach((e) => {
      nodeIds.add(e.source);
      nodeIds.add(e.target);
    });

    const subNodes = Array.from(nodeIds)
      .map((id) => this.nodes.get(id))
      .filter((n): n is GraphNode => !!n);

    return {
      nodes: subNodes,
      edges: matchedEdges,
    };
  }

  public addNode(node: GraphNode) {
    this.nodes.set(node.id, node);
  }

  public addEdge(edge: GraphEdge) {
    this.edges.push(edge);
  }
}

export const knowledgeGraphEngine = KnowledgeGraphEngine.getInstance();
