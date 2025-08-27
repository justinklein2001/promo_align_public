'use client'
import React from 'react';
import { ReactFlow } from '@xyflow/react';
import { Box } from '@mui/material';
import '@xyflow/react/dist/style.css';

import AlertComponent from '../components/AlertComponent';

// Components
import NodeComponent from '../components/NodeComponent';
import SaveConfirmationModal from '../components/SaveConfirmationModal';
import NodeDialog from '../components/NodeDialog';
import AppToolbar from '../components/AppToolbar';
import SaveButton from '../components/SaveButton';

// Hooks
import { useAppState } from '../hooks/useAppState';

export default function Home() {
  const {
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
  } = useAppState();
  
  const nodeTypes = { 
    promo: (props: any) => (
      <NodeComponent 
        {...props} 
        onDelete={() => handleConfirmDelete(props.id)}
        showDelete={isAuthenticated}
      />
    ), 
    song: (props: any) => (
      <NodeComponent 
        {...props} 
        onDelete={() => handleConfirmDelete(props.id)}
        showDelete={isAuthenticated}
      />
    )
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      {alert && (
        <AlertComponent
          open={true}
          message={alert.message}
          severity={alert.severity}
          autoHideDuration={3000}
          onClose={() => setAlert(null)}
        />
      )}
      
      <AppToolbar
        isAuthenticated={isAuthenticated}
        onAddSongNode={() => handleAddNode('song')}
        onAddPromoNode={() => handleAddNode('promo')}
        onLogout={handleLogout}
      />
      
      <SaveButton
        pendingChanges={pendingChanges}
        onSave={() => setShowSaveModal(true)}
        isAuthenticated={isAuthenticated}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={(_, edge) => {
          handleConfirmDeleteEdge(edge.id);
        }}
        nodeTypes={nodeTypes}
        fitView
      />
      
      <SaveConfirmationModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleSave}
        changes={pendingChanges}
        loading={saving}
      />
      
      <NodeDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        nodeType={nodeType}
        selectedNode={selectedNode}
        nodes={nodes}
        deletedNodes={deletedNodes}
        onSubmit={onSubmit}
      />
      
      {confirmDeleteNodeId && (
        <AlertComponent
          open={true}
          message="Are you sure you want to delete this node?"
          severity="warning"
          isConfirmation={true}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            handleDeleteNode(confirmDeleteNodeId);
            setConfirmDeleteNodeId(null);
          }}
          onCancel={() => setConfirmDeleteNodeId(null)}
          onClose={() => setConfirmDeleteNodeId(null)}
        />
      )}
      
      {confirmDeleteEdgeId && (
        <AlertComponent
          open={true}
          message="Are you sure you want to delete this connection?"
          severity="warning"
          isConfirmation={true}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            handleDeleteEdge(confirmDeleteEdgeId);
            setConfirmDeleteEdgeId(null);
          }}
          onCancel={() => setConfirmDeleteEdgeId(null)}
          onClose={() => setConfirmDeleteEdgeId(null)}
        />
      )}
    </Box>
  );
}
