'use client'
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

interface Change {
  type: 'node_moved' | 'node_deleted' | 'edge_added' | 'edge_deleted';
  description: string;
  nodeId?: string;
  edgeId?: string;
}

export function useAppState() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nodeType, setNodeType] = useState<'song' | 'promo'>('song');
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [alert, setAlert] = useState<{ message: string, severity: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [confirmDeleteNodeId, setConfirmDeleteNodeId] = useState<string | null>(null);
  const [confirmDeleteEdgeId, setConfirmDeleteEdgeId] = useState<string | null>(null);
  
  // Save functionality state
  const [originalNodes, setOriginalNodes] = useState<CustomNode[]>([]);
  const [originalEdges, setOriginalEdges] = useState<Edge[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Change[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletedNodes, setDeletedNodes] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const initialLoadRef = useRef(false);

  // Load initial data
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    
    const loadData = async() => {
      try {
        const [nodesRes, edgesRes] = await Promise.all([
          fetch("/api/get-nodes"),
          fetch("/api/get-edges")
        ]);

        if (!nodesRes.ok || !edgesRes.ok) {
          setAlert({ message: 'Could not fetch data.', severity: 'error' });
          setTimeout(() => setAlert(null), 3000);
          return;
        }

        const [nodesData, edgesData] = await Promise.all([
          nodesRes.json(),
          edgesRes.json()
        ]);
        
        setNodes(nodesData);
        setEdges(edgesData);
        setOriginalNodes(JSON.parse(JSON.stringify(nodesData)));
        setOriginalEdges(JSON.parse(JSON.stringify(edgesData)));
      } catch (error) {
        setAlert({ message: 'Error loading data.', severity: 'error' });
        setTimeout(() => setAlert(null), 3000);
      }
    };
    
    loadData();
  }, [setEdges, setNodes]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-auth');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
        }
      } catch {}
    };
    checkAuth();
  }, []);

  // Track changes
  useEffect(() => {
    if (!initialLoadRef.current) return;
    
    const changes: Change[] = [];
    
    // Check for moved nodes
    nodes.forEach(node => {
      if (deletedNodes.has(node.id)) return;
      
      const original = originalNodes.find(n => n.id === node.id);
      if (original && (
        original.position.x !== node.position.x || 
        original.position.y !== node.position.y
      )) {
        changes.push({
          type: 'node_moved',
          description: `Moved "${node.data.title}" node`,
          nodeId: node.id
        });
      }
    });
    
    // Check for deleted nodes
    deletedNodes.forEach(nodeId => {
      const original = originalNodes.find(n => n.id === nodeId);
      if (original) {
        changes.push({
          type: 'node_deleted',
          description: `Deleted "${original.data.title}" node`,
          nodeId: nodeId
        });
      }
    });
    
    // Check for new edges
    edges.forEach(edge => {
      if (!originalEdges.find(e => e.id === edge.id)) {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        changes.push({
          type: 'edge_added',
          description: `Connected "${sourceNode?.data.title}" to "${targetNode?.data.title}"`,
          edgeId: edge.id
        });
      }
    });
    
    // Check for deleted edges
    originalEdges.forEach(edge => {
      if (!edges.find(e => e.id === edge.id)) {
        const sourceNode = originalNodes.find(n => n.id === edge.source);
        const targetNode = originalNodes.find(n => n.id === edge.target);
        changes.push({
          type: 'edge_deleted',
          description: `Disconnected "${sourceNode?.data.title}" from "${targetNode?.data.title}"`,
          edgeId: edge.id
        });
      }
    });
    
    setPendingChanges(changes);
  }, [nodes, edges, originalNodes, originalEdges, deletedNodes]);

  // Node logic
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, id: uuidv4() }, eds));
  }, [setEdges]);

  const handleAddNode = (type: 'song' | 'promo') => {
    // Check if trying to add promo node when no song nodes exist
    if (type === 'promo') {
      const songNodes = nodes.filter(n => n.type === 'song' && !deletedNodes.has(n.id));
      if (songNodes.length === 0) {
        setAlert({ message: 'You must create at least one song node before creating a promo node.', severity: 'info' });
        setTimeout(() => setAlert(null), 3000);
        return;
      }
    }
    
    setNodeType(type);
    setOpenDialog(true);
    setSelectedNode(null);
  };

  const handleNodeClick = (_: unknown, node: CustomNode) => {
    if (isAuthenticated) {
      setSelectedNode(node);
      setNodeType(node?.type ?? nodeType);
      setOpenDialog(true);
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes => nodes.filter(n => n.id !== nodeId));
    setEdges(edges => edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    setDeletedNodes(prev => new Set([...prev, nodeId]));
  };

  const handleDeleteEdge = (edgeId: string) => {
    setEdges(edges => edges.filter(e => e.id !== edgeId));
  };

  const handleConfirmDelete = (nodeId: string) => {
    setConfirmDeleteNodeId(nodeId);
  };

  const handleConfirmDeleteEdge = (edgeId: string) => {
    setConfirmDeleteEdgeId(edgeId);
  };

  const isPromoData = (data: PromoNodeData | SongNodeData): data is PromoNodeData => {
    return (data as PromoNodeData).sketches !== undefined;
  };

  const isSongData = (data: PromoNodeData | SongNodeData): data is SongNodeData => {
    return (data as SongNodeData).audioFile !== undefined;
  };

  // form submission
  const onSubmit = async (data: PromoNodeData | SongNodeData) => {
    const id = selectedNode?.id || uuidv4();
    const position = selectedNode?.position || { x: Math.random() * 500, y: Math.random() * 500 };
    const newNode: CustomNode = { id, type: nodeType, position, data };
    const formData = new FormData();
    formData.append("node", JSON.stringify(newNode));
    formData.append("type", nodeType);

    if (isPromoData(data)) {
      data.sketches.forEach((file) => {
        formData.append('sketches[]', file);
      });
    } else if (isSongData(data)) {
      formData.append("audioFile", data.audioFile);
      formData.append("albumCover", data.albumCover);
    }
    
    const res = await fetch("/api/add-node", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setAlert({ message: 'Upload failed!', severity: 'error' });
      setTimeout(() => setAlert(null), 3000);
    } else {
      setAlert({ message: 'Node saved successfully!', severity: 'success' });
      setTimeout(() => setAlert(null), 3000);
      setOpenDialog(false);
      
      // Refresh nodes and edges from server
      const [nodesRes, edgesRes] = await Promise.all([
        fetch("/api/get-nodes"),
        fetch("/api/get-edges")
      ]);
      
      if (nodesRes.ok) {
        const nodesData = await nodesRes.json();
        setNodes(nodesData);
        setOriginalNodes(JSON.parse(JSON.stringify(nodesData)));
      }
      
      if (edgesRes.ok) {
        const edgesData = await edgesRes.json();
        setEdges(edgesData);
        setOriginalEdges(JSON.parse(JSON.stringify(edgesData)));
      }
      
      // Clear pending changes
      setPendingChanges([]);
      setDeletedNodes(new Set());
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save node positions and deletions
      const nodesToUpdate = nodes.filter(node => !deletedNodes.has(node.id));
      
      // Delete nodes first
      for (const nodeId of deletedNodes) {
        const nodeToDelete = originalNodes.find(n => n.id === nodeId);
        // Delete nodes in db tables
        if (nodeToDelete) {
          await fetch(`/api/delete-node?id=${nodeId}&type=${nodeToDelete.type}`, {
            method: 'DELETE'
          });
          // Delete uploaded files
          if (nodeToDelete.type === "song") {
            const nodeToDeleteData = nodeToDelete?.data as SongNodeData
            try {
              await fetch(`/api/delete-file?path=${encodeURIComponent(nodeToDeleteData.audioFile as string)}`, {
                method: 'DELETE',
              });
              } catch (error) {
                console.error('Failed to delete audio file:', error);
              }

              try {
              await fetch(`/api/delete-file?path=${encodeURIComponent(nodeToDeleteData.albumCover as string)}`, {
                method: 'DELETE',
              });
              } catch (error) {
                console.error('Failed to delete album cover file:', error);
              }
          } else if (nodeToDelete.type === "promo"){
              const nodeToDeleteData = nodeToDelete?.data as PromoNodeData
              nodeToDeleteData.sketches?.forEach(async (file: File | string) => {
                 try {
                  await fetch(`/api/delete-file?path=${encodeURIComponent(file as string)}`, {
                    method: 'DELETE',
                  });
                } catch (error) {
                  console.error('Failed to delete album cover file:', error);
                }
              });
          }
        } 
      }
      
      // Update node positions
      if (nodesToUpdate.length > 0) {
        await fetch('/api/update-node-positions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes: nodesToUpdate })
        });
      }
      
      // Save edges
      await fetch('/api/save-edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edges })
      });
      
      // Update original state
      setOriginalNodes(JSON.parse(JSON.stringify(nodesToUpdate)));
      setOriginalEdges(JSON.parse(JSON.stringify(edges)));
      setPendingChanges([]);
      setDeletedNodes(new Set());
      
      setAlert({ message: 'Changes saved successfully!', severity: 'success' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ message: 'Failed to save changes!', severity: 'error' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setSaving(false);
      setShowSaveModal(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  return {
    // State
    nodes,
    edges,
    openDialog,
    nodeType,
    selectedNode,
    alert,
    confirmDeleteNodeId,
    confirmDeleteEdgeId,
    pendingChanges,
    showSaveModal,
    saving,
    deletedNodes,
    isAuthenticated,
    
    // Setters
    setOpenDialog,
    setShowSaveModal,
    setAlert,
    setConfirmDeleteNodeId,
    setConfirmDeleteEdgeId,
    
    // Handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleAddNode,
    handleNodeClick,
    handleDeleteNode,
    handleDeleteEdge,
    handleConfirmDelete,
    handleConfirmDeleteEdge,
    onSubmit,
    handleSave,
    handleLogout,
  };
}
