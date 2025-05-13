<<<<<<< HEAD

=======
>>>>>>> 29e8480 (updated code)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/auth-context";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import FindMentors from "./pages/FindMentors";
import RequestSession from "./pages/RequestSession";
import SessionRequests from "./pages/SessionRequests";
import SessionDetail from "./pages/SessionDetail";
import Availability from "./pages/Availability";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
=======
import Profile from "./pages/Profile";
>>>>>>> 29e8480 (updated code)
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
        <AuthProvider>
          <BrowserRouter>
=======
        <BrowserRouter>
          <AuthProvider>
>>>>>>> 29e8480 (updated code)
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/session/:sessionId" element={<SessionDetail />} />
              <Route path="/find-mentors" element={<FindMentors />} />
              <Route path="/request-session/:mentorId" element={<RequestSession />} />
              <Route path="/requests" element={<SessionRequests />} />
              <Route path="/availability" element={<Availability />} />
<<<<<<< HEAD
              <Route path="/profile" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
=======
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <Toaster />
        </BrowserRouter>
>>>>>>> 29e8480 (updated code)
      </QueryClientProvider>
    </>
  );
}

export default App;
