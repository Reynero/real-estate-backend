import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { FavoritesPage } from "@/features/favorites/pages/FavoritesPage";
import { LandingPage } from "@/features/home/pages/LandingPage";
import { AdminPropertiesPage } from "@/features/properties/pages/AdminPropertiesPage";
import { CreatePropertyPage } from "@/features/properties/pages/CreatePropertyPage";
import { EditPropertyPage } from "@/features/properties/pages/EditPropertyPage";
import { MyListingsPage } from "@/features/properties/pages/MyListingsPage";
import { PropertyDetailPage } from "@/features/properties/pages/PropertyDetailPage";
import { PropertyInquiriesPage } from "@/features/properties/pages/PropertyInquiriesPage";
import { PropertyListPage } from "@/features/properties/pages/PropertyListPage";
import { AccountSettingsPage } from "@/features/users/pages/AccountSettingsPage";
import { AdminRoute } from "@/shared/components/AdminRoute";
import { Navbar } from "@/shared/components/Navbar";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linen">
      <Navbar />
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/browse"
          element={
            <Layout>
              <PropertyListPage />
            </Layout>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <Layout>
              <PropertyDetailPage />
            </Layout>
          }
        />

        {/* Requires login */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Layout>
                <FavoritesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <Layout>
                <MyListingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings/new"
          element={
            <ProtectedRoute>
              <Layout>
                <CreatePropertyPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EditPropertyPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings/:id/inquiries"
          element={
            <ProtectedRoute>
              <Layout>
                <PropertyInquiriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountSettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin/properties"
          element={
            <AdminRoute>
              <Layout>
                <AdminPropertiesPage />
              </Layout>
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;