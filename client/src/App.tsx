import { useEffect, Suspense, startTransition } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import RegisterFinder from "@/pages/auth/register-finder";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import ClientDashboard from "@/pages/client/dashboard";
import CreateRequest from "@/pages/client/create-request";
import RequestDetails from "@/pages/client/request-details";
import ViewProposals from "@/pages/client/view-proposals";
import ClientBrowseRequests from "@/pages/client/browse-requests";
import ClientProfile from "@/pages/client/profile";
import ClientContracts from "@/pages/client/contracts";
import ContractDetails from "@/pages/client/contract-details";
import PaymentSuccess from "@/pages/client/payment-success";
import ClientThankYou from "@/pages/client/thank-you";
import ChangePassword from "@/pages/client/change-password";
import FinderDashboard from "@/pages/finder/dashboard";
import FinderBrowseRequests from "@/pages/finder/browse-requests";
import FinderRequestDetails from "@/pages/finder/request-details";
import FinderProposals from "@/pages/finder/proposals";
import FinderProposalDetails from "@/pages/finder/proposal-details";
import ProposalDetail from "@/pages/client/proposal-detail";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import { AdminUserProfile } from "@/pages/admin/user-profile";
import AdminRequests from "@/pages/admin/requests";
import AdminCategories from "@/pages/admin/categories";
import AdminSettings from "@/pages/admin/settings";
import AdminProfile from "./pages/admin/profile";
import AdminWithdrawals from "@/pages/admin/withdrawals";
import AdminTokenPackages from "@/pages/admin/token-packages";
import AdminTokenManagement from "@/pages/admin/token-management";
import AdminBlogPosts from "@/pages/admin/blog-posts";
import AdminBlogPostCreate from "@/pages/admin/blog-post-create";
import AdminBlogPostEdit from "@/pages/admin/blog-post-edit";
import AdminFinderLevels from "@/pages/admin/finder-levels";
import AdminStrikeSystem from "@/pages/admin/StrikeSystem";
import AdminRestrictedWords from "@/pages/admin/restricted-words";
import AdminSupportAgents from "@/pages/admin/support-agents";
import AdminFAQManagement from "./pages/admin/faq-management";
import BlogPost from "@/pages/blog-post";
import Messages from "@/pages/Messages";
import ConversationDetail from "@/pages/ConversationDetail";
import FinderPublicProfile from "@/pages/finder-profile";
import FinderProfile from "@/pages/finder/profile";
import FinderTokens from "@/pages/finder/tokens";
import FinderTokenPurchase from "@/pages/finder/token-purchase";
import FinderPaymentSuccess from "@/pages/finder/payment-success";
import FinderThankYou from "@/pages/finder/thank-you";
import ClientTokens from "@/pages/client/tokens";
import FinderWithdrawals from "@/pages/finder/withdrawals";
import FinderSecurity from "@/pages/finder/security";
import FinderContracts from "@/pages/finder/contracts";
import FinderContractDetails from "@/pages/finder/contract-details";
import MobileLanding from "@/pages/mobile-landing";
import ClientMobileDashboard from "@/pages/client/mobile-dashboard";
import OrderSubmission from "@/pages/order-submission";
import OrderReview from "@/pages/order-review";
import SupportIndex from "@/pages/support/index";
import HelpCenter from "@/pages/support/help-center";
import ContactSupport from "@/pages/support/contact";
import BrowseRequests from "@/pages/BrowseRequests";
import { AuthProvider } from "@/hooks/use-auth";
import "./lib/i18n"; // Initialize i18n
import { lazy } from "react";
import TermsAndConditions from "@/pages/terms-and-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";
import AdminVerificationManagement from "./pages/admin/verification-management";
import Verification from "./pages/verification";
import AgentDashboard from "@/pages/agent/dashboard";
import AgentTickets from "@/pages/agent/tickets";
import AgentTicketDetails from "@/pages/agent/ticket-details";
import AdminContactSettings from "./pages/admin/contact-settings";
import AdminDatabaseExport from "./pages/admin/database-export";
import AdminFAQCategories from "./pages/admin/faq-categories";
import { AdminFinancialDashboard } from "@/pages/admin/financial-dashboard";
import AdminContractManagement from "@/pages/admin/contract-management";
import AdminDisputes from "@/pages/admin/disputes";
import { BanAlertDemo } from "@/components/BanAlertDemo";
import AboutUs from "@/pages/about-us";
import {
  AdminRoute,
  FinderRoute,
  ClientRoute,
  AuthenticatedRoute,
  AgentRoute
} from "@/components/ProtectedRoute";

// Dynamically import ResetPassword component
const ResetPassword = lazy(() => import("@/pages/auth/reset-password"));

// Component to guard auth pages from logged in users
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if we have a valid token in localStorage
    const hasToken = !!localStorage.getItem('findermeister_token');

    if (!isLoading && hasToken && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'finder') {
        navigate('/finder/dashboard');
      } else if (user.role === 'client') {
        navigate('/client/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if we have a valid token in localStorage
  const hasToken = !!localStorage.getItem('findermeister_token');

  if (hasToken && isAuthenticated && user) {
    return null; // Let useEffect handle the navigation
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/mobile" component={MobileLanding} />
      <Route path="/browse-requests" component={BrowseRequests} />
      <Route path="/client/mobile-dashboard" component={ClientMobileDashboard} />
      <Route path="/login" component={() => <AuthGuard><Login /></AuthGuard>} />
      <Route path="/register" component={() => <AuthGuard><Register /></AuthGuard>} />
      <Route path="/register/finder" component={() => <AuthGuard><RegisterFinder /></AuthGuard>} />
      {/* Add reset password route */}
      <Route path="/reset-password" component={() => (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
              <p>Loading Reset Password...</p>
            </div>
          </div>
        }>
          <ResetPassword />
        </Suspense>
      )} />
      <Route path="/client/dashboard" component={() => <ClientRoute><ClientDashboard /></ClientRoute>} />
      <Route path="/client/create-find" component={() => <ClientRoute><CreateRequest /></ClientRoute>} />
      <Route path="/client/finds/:id" component={() => <ClientRoute><RequestDetails /></ClientRoute>} />
      <Route path="/client/proposals" component={() => <ClientRoute><ViewProposals /></ClientRoute>} />
      <Route path="/client/proposals/:id" component={() => <ClientRoute><ProposalDetail /></ClientRoute>} />
      <Route path="/client/contracts" component={() => <ClientRoute><ClientContracts /></ClientRoute>} />
      <Route path="/client/contracts/:contractId" component={() => <ClientRoute><ContractDetails /></ClientRoute>} />
      <Route path="/client/fund-contract/:contractId" component={() => <ClientRoute><ContractDetails /></ClientRoute>} />
      <Route path="/client/payment-success" component={PaymentSuccess} />
      <Route path="/client/thank-you" component={() => <ClientRoute><ClientThankYou /></ClientRoute>} />
      <Route path="/client/browse-finds" component={() => <ClientRoute><ClientBrowseRequests /></ClientRoute>} />
      <Route path="/client/browse-requests" component={() => <ClientRoute><ClientBrowseRequests /></ClientRoute>} />
      <Route path="/client/finds" component={() => <ClientRoute><ClientBrowseRequests /></ClientRoute>} />
      <Route path="/client/profile" component={() => <ClientRoute><ClientProfile /></ClientRoute>} />
      <Route path="/client/profile/:userId" component={() => <ClientRoute><ClientProfile /></ClientRoute>} />
      <Route path="/client/tokens" component={() => <ClientRoute><ClientTokens /></ClientRoute>} />
      <Route path="/client/change-password" component={() => <ClientRoute><ChangePassword /></ClientRoute>} />
      <Route path="/finder/dashboard" component={() => <FinderRoute><FinderDashboard /></FinderRoute>} />
      <Route path="/finder/browse-finds" component={() => <FinderRoute><FinderBrowseRequests /></FinderRoute>} />
      <Route path="/finder/browse-requests" component={() => <FinderRoute><FinderBrowseRequests /></FinderRoute>} />
      <Route path="/finder/finds/:id" component={() => <FinderRoute><FinderRequestDetails /></FinderRoute>} />
      <Route path="/finder/requests/:id" component={() => <FinderRoute><FinderRequestDetails /></FinderRoute>} />
      <Route path="/finder/proposals" component={() => <FinderRoute><FinderProposals /></FinderRoute>} />
      <Route path="/finder/proposals/:id" component={() => <FinderRoute><FinderProposalDetails /></FinderRoute>} />
      <Route path="/finder/contracts" component={() => <FinderRoute><FinderContracts /></FinderRoute>} />
      <Route path="/finder/contracts/:contractId" component={() => <FinderRoute><FinderContractDetails /></FinderRoute>} />
      <Route path="/finder/profile" component={() => <FinderRoute><FinderProfile /></FinderRoute>} />
      <Route path="/finder-profile/:userId" component={FinderPublicProfile} />
      <Route path="/finder/tokens" component={() => <FinderRoute><FinderTokens /></FinderRoute>} />
      <Route path="/finder/token-purchase" component={() => <FinderRoute><FinderTokenPurchase /></FinderRoute>} />
      <Route path="/finder/payment-success" component={FinderPaymentSuccess} />
      <Route path="/finder/thank-you" component={() => <FinderRoute><FinderThankYou /></FinderRoute>} />
      <Route path="/finder/withdrawals" component={() => <FinderRoute><FinderWithdrawals /></FinderRoute>} />
      <Route path="/finder/security" component={() => <FinderRoute><FinderSecurity /></FinderRoute>} />
      <Route path="/orders/submit/:contractId" component={() => <AuthenticatedRoute><OrderSubmission /></AuthenticatedRoute>} />
      <Route path="/orders/review/:contractId" component={() => <AuthenticatedRoute><OrderReview /></AuthenticatedRoute>} />
      <Route path="/support" component={SupportIndex} />
      <Route path="/support/help-center" component={HelpCenter} />
      <Route path="/support/contact" component={ContactSupport} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/ban-alert-demo" component={BanAlertDemo} />
      <Route path="/admin/dashboard" component={() => <AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" component={() => <AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/users/:id" component={() => <AdminRoute><AdminUserProfile /></AdminRoute>} />
      <Route path="/admin/requests" component={() => <AdminRoute><AdminRequests /></AdminRoute>} />
      <Route path="/admin/categories" component={() => <AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/settings" component={() => <AdminRoute><AdminSettings /></AdminRoute>} />
      <Route path="/admin/profile" component={AdminProfile} />
      <Route path="/admin/withdrawals" component={() => <AdminRoute><AdminWithdrawals /></AdminRoute>} />
      <Route path="/admin/token-packages" component={() => <AdminRoute><AdminTokenPackages /></AdminRoute>} />
      <Route path="/admin/token-management" component={() => <AdminRoute><AdminTokenManagement /></AdminRoute>} />
      <Route path="/admin/finder-levels" component={() => <AdminRoute><AdminFinderLevels /></AdminRoute>} />
      <Route path="/admin/restricted-words" component={() => <AdminRoute><AdminRestrictedWords /></AdminRoute>} />
      <Route path="/admin/support-agents" component={() => <AdminRoute><AdminSupportAgents /></AdminRoute>} />
      <Route path="/admin/faq-management" component={() => <AdminRoute><AdminFAQManagement /></AdminRoute>} />
      <Route path="/admin/faq-categories" component={() => <AdminRoute><AdminFAQCategories /></AdminRoute>} />
      <Route path="/admin/contact-settings" component={() => <AdminRoute><AdminContactSettings /></AdminRoute>} />
      <Route path="/admin/database-export" component={() => <AdminRoute><AdminDatabaseExport /></AdminRoute>} />
      <Route path="/admin/verification-management" component={() => <AdminRoute><AdminVerificationManagement /></AdminRoute>} />
      <Route path="/verification" component={Verification} />

      {/* Agent Routes */}
      <Route path="/agent/dashboard" component={() => <AgentRoute><AgentDashboard /></AgentRoute>} />
      <Route path="/agent/tickets" component={() => <AgentRoute><AgentTickets /></AgentRoute>} />
      <Route path="/agent/tickets/:id" component={() => <AgentRoute><AgentTicketDetails /></AgentRoute>} />

      {/* Blog Routes */}
      <Route path="/admin/blog-posts" component={() => <AdminRoute><AdminBlogPosts /></AdminRoute>} />
      <Route path="/admin/blog-posts/create" component={() => <AdminRoute><AdminBlogPostCreate /></AdminRoute>} />
      <Route path="/admin/blog-posts/edit/:id" component={() => <AdminRoute><AdminBlogPostEdit /></AdminRoute>} />
      <Route path="/admin/strike-system" component={() => <AdminRoute><AdminStrikeSystem /></AdminRoute>} />
      <Route path="/admin/financial-dashboard" component={() => {
        const FinancialDashboard = lazy(() => import("@/pages/admin/financial-dashboard"));
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
                <p>Loading Financial Dashboard...</p>
              </div>
            </div>
          }>
            <AdminRoute><FinancialDashboard /></AdminRoute>
          </Suspense>
        );
      }} />
      <Route path="/admin/monthly-token-grant" component={() => {
         const MonthlyTokenGrant = lazy(() => import("@/pages/admin/monthly-token-grant"));
         return (
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
                <p>Loading Monthly Token Grant...</p>
              </div>
            </div>
          }>
            <AdminRoute><MonthlyTokenGrant /></AdminRoute>
          </Suspense>
         );
       }} />
       <Route path="/admin/autonomous-fund" component={() => {
         const AutonomousFund = lazy(() => import("@/pages/admin/autonomous-fund"));
         return (
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
                <p>Loading Autonomous Fund...</p>
              </div>
            </div>
          }>
            <AdminRoute><AutonomousFund /></AdminRoute>
          </Suspense>
         );
       }} />
       <Route path="/admin/contract-management" component={() => <AdminRoute><AdminContractManagement /></AdminRoute>} />
      <Route path="/admin/disputes" component={() => <AdminRoute><AdminDisputes /></AdminRoute>} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/messages" component={() => <AuthenticatedRoute><Messages /></AuthenticatedRoute>} />
      <Route path="/messages/:conversationId" component={() => <AuthenticatedRoute><ConversationDetail /></AuthenticatedRoute>} />
      <Route path="/finder-profile/:finderId" component={FinderPublicProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;