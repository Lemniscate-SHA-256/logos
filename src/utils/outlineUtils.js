// src/utils/outlineUtils.js
export const updateSectionTitles = (node, targetId, newTitle) => {
    // Base case: Found the node to update
    if (node.id === targetId) {
      return { ...node, title: newTitle };
    }
  
    // Recursive case: Check children
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => 
          updateSectionTitles(child, targetId, newTitle)
        )
      };
    }
  
    // No changes needed for this node
    return node;
  };