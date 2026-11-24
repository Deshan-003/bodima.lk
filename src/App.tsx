import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import PropertyDetails from "./pages/PropertyDetails";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ChatsPage from "./pages/ChatsPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import Placeholder from "./pages/Placeholder";
import FloatingChatbot from "./components/FloatingChatbot";
import AdminRoute from "./admin/components/AdminRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Listings from "./admin/pages/Listings";
import PendingListings from "./admin/pages/PendingListings";
import ReportedListings from "./admin/pages/ReportedListings";
import Locations from "./admin/pages/Locations";
import Users from "./admin/pages/Users";
import Seekers from "./admin/pages/Seekers";
import Owners from "./admin/pages/Owners";
import Messages from "./admin/pages/Messages";
import Reviews from "./admin/pages/Reviews";
import Reports from "./admin/pages/Reports";
import Analytics from "./admin/pages/Analytics";
import Notifications from "./admin/pages/Notifications";
import Settings from "./admin/pages/Settings";

export default function App() {
  const { pathname } = useLocation();
  const seekerArea = pathname.startsWith("/browse") || pathname === "/chats";

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/:id" element={<PropertyDetails />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/about" element={<Placeholder title="About Bodima.lk" />} />
        <Route path="/contact" element={<Placeholder title="Contact Us" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        {/* Frontend-only admin console */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="listings" element={<Listings />} />
          <Route path="listings/pending" element={<PendingListings />} />
          <Route path="listings/reported" element={<ReportedListings />} />
          <Route path="locations" element={<Locations />} />
          <Route path="users" element={<Users />} />
          <Route path="users/seekers" element={<Seekers />} />
          <Route path="users/owners" element={<Owners />} />
          <Route path="messages" element={<Messages />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Placeholder title="Page Not Found" />} />
      </Routes>
      {seekerArea && <FloatingChatbot />}
    </>
  );
}
