import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Developer Narrative: ProtectedRoute
 * 
 * Purpose: Acts as a security gatekeeper for all `/admin/*` routes.
 * Data Flow:
 *   - Consumes `isAuthenticated` and `isLoading` from AuthContext.
 *   - If the user is unauthenticated, it forcefully redirects the router to `/admin/login`.
 *   - If authenticated, it renders the `<Outlet />` (which will be the AdminLayout and its child pages).
 */

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen bg-[#050B14] flex justify-center items-center text-white">Loading Security Context...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Wrap the matched child route
    return <Outlet />;
};

export default ProtectedRoute;
