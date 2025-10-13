'use client';

import React, { useState } from 'react';
import { MapPin, Truck, Ship, Plane, Package, AlertCircle } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'origin' | 'port' | 'warehouse' | 'destination';
  country: string;
  coordinates: [number, number]; // [lat, lng]
  capacity?: number;
  utilization?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface NetworkEdge {
  from: string;
  to: string;
  type: 'road' | 'sea' | 'air' | 'rail';
  volume: number;
  cost: number;
  duration: number; // in days
  reliability: number; // 0-100%
  status: 'active' | 'disrupted' | 'delayed';
}

interface SupplyChainNetworkProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  title?: string;
  height?: number;
  showMetrics?: boolean;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'origin':
      return <Package className="h-4 w-4" />;
    case 'port':
      return <Ship className="h-4 w-4" />;
    case 'warehouse':
      return <MapPin className="h-4 w-4" />;
    case 'destination':
      return <Truck className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const getNodeColor = (type: string, riskLevel?: string) => {
  const baseColors = {
    origin: 'bg-green-500',
    port: 'bg-blue-500',
    warehouse: 'bg-purple-500',
    destination: 'bg-orange-500',
  };

  if (riskLevel === 'high') return 'bg-red-500';
  if (riskLevel === 'medium') return 'bg-yellow-500';

  return baseColors[type as keyof typeof baseColors] || 'bg-gray-500';
};

const getEdgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'stroke-green-500';
    case 'disrupted':
      return 'stroke-red-500';
    case 'delayed':
      return 'stroke-yellow-500';
    default:
      return 'stroke-gray-400';
  }
};

const _getTransportIcon = (type: string) => {
  switch (type) {
    case 'road':
      return <Truck className="h-3 w-3" />;
    case 'sea':
      return <Ship className="h-3 w-3" />;
    case 'air':
      return <Plane className="h-3 w-3" />;
    case 'rail':
      return <Package className="h-3 w-3" />;
    default:
      return <Truck className="h-3 w-3" />;
  }
};

export const SupplyChainNetwork: React.FC<SupplyChainNetworkProps> = ({
  nodes,
  edges,
  title = 'Supply Chain Network',
  height = 500,
  showMetrics = true,
}) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge | null>(null);

  // Calculate network metrics
  const totalVolume = edges.reduce((sum, edge) => sum + edge.volume, 0);
  const averageReliability =
    edges.reduce((sum, edge) => sum + edge.reliability, 0) / edges.length;
  const disruptedRoutes = edges.filter(
    edge => edge.status === 'disrupted'
  ).length;
  const _highRiskNodes = nodes.filter(node => node.riskLevel === 'high').length;

  // Simple layout algorithm - arrange nodes in a grid
  const gridCols = Math.ceil(Math.sqrt(nodes.length));
  const nodePositions = nodes.reduce(
    (acc, node, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      acc[node.id] = {
        x: (col + 1) * (800 / (gridCols + 1)),
        y: (row + 1) * (height / (Math.ceil(nodes.length / gridCols) + 1)),
      };
      return acc;
    },
    {} as Record<string, { x: number; y: number }>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showMetrics && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Total Volume: {totalVolume.toLocaleString()} MT</span>
            <span>Avg Reliability: {averageReliability.toFixed(1)}%</span>
            {disruptedRoutes > 0 && (
              <span className="flex items-center text-red-600">
                <AlertCircle className="mr-1 h-4 w-4" />
                {disruptedRoutes} Disrupted
              </span>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="relative" style={{ height }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render edges */}
            {edges.map(edge => {
              const fromPos = nodePositions[edge.from];
              const toPos = nodePositions[edge.to];
              if (!fromPos || !toPos) return null;

              return (
                <g key={`edge-${edge.from}-${edge.to}`}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    className={`${getEdgeColor(edge.status)} hover:stroke-width-3 cursor-pointer transition-all`}
                    strokeWidth={Math.max(2, edge.volume / 1000)}
                    strokeDasharray={edge.status === 'delayed' ? '5,5' : 'none'}
                    onClick={() => setSelectedEdge(edge)}
                  />
                  {/* Transport type indicator */}
                  <circle
                    cx={(fromPos.x + toPos.x) / 2}
                    cy={(fromPos.y + toPos.y) / 2}
                    r="8"
                    className="fill-white stroke-gray-400"
                  />
                </g>
              );
            })}
          </svg>

          {/* Render nodes */}
          {nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer"
                style={{ left: pos.x, top: pos.y }}
                onClick={() => setSelectedNode(node)}
              >
                <div
                  className={`h-8 w-8 rounded-full ${getNodeColor(node.type, node.riskLevel)} flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110`}
                >
                  {getNodeIcon(node.type)}
                </div>
                <div className="mt-1 whitespace-nowrap text-center text-xs font-medium text-gray-700">
                  {node.name}
                </div>
                {node.utilization && (
                  <div className="mt-1 text-center text-xs text-gray-500">
                    {node.utilization}% util.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Node Types
              </h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                    <Package className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Origin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                    <Ship className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Port</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500">
                    <MapPin className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Warehouse</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500">
                    <Truck className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">Destination</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Route Status
              </h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-4 bg-green-500"></div>
                  <span className="text-xs text-gray-600">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-4 bg-yellow-500"></div>
                  <span className="text-xs text-gray-600">Delayed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-4 bg-red-500"></div>
                  <span className="text-xs text-gray-600">Disrupted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected node/edge details */}
        {(selectedNode || selectedEdge) && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            {selectedNode && (
              <div>
                <h4 className="font-medium text-gray-900">
                  {selectedNode.name}
                </h4>
                <div className="mt-1 text-sm text-gray-600">
                  <p>Type: {selectedNode.type}</p>
                  <p>Country: {selectedNode.country}</p>
                  {selectedNode.capacity && (
                    <p>Capacity: {selectedNode.capacity.toLocaleString()} MT</p>
                  )}
                  {selectedNode.utilization && (
                    <p>Utilization: {selectedNode.utilization}%</p>
                  )}
                  {selectedNode.riskLevel && (
                    <p>Risk Level: {selectedNode.riskLevel}</p>
                  )}
                </div>
              </div>
            )}
            {selectedEdge && (
              <div>
                <h4 className="font-medium text-gray-900">Route Details</h4>
                <div className="mt-1 text-sm text-gray-600">
                  <p>Transport: {selectedEdge.type}</p>
                  <p>Volume: {selectedEdge.volume.toLocaleString()} MT</p>
                  <p>Duration: {selectedEdge.duration} days</p>
                  <p>Reliability: {selectedEdge.reliability}%</p>
                  <p>Status: {selectedEdge.status}</p>
                  <p>Cost: ${selectedEdge.cost.toLocaleString()}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedNode(null);
                setSelectedEdge(null);
              }}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
