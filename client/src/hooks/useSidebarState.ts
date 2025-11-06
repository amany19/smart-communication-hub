// hooks/useSidebarState.ts
import { useState, useCallback } from 'react';

export function useSidebarState() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const toggleUsersView = useCallback(() => {
    setShowAllUsers(prev => !prev);
  }, []);

  return {
    // State
    isMobileOpen,
    showAllUsers,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleUsersView,
    
    // Combined actions
    setShowAllUsers,
    setIsMobileOpen,
  };
}