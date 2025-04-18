import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProfileSetup from "./components/profile/ProfileSetup";
import { auth, getUserProfile } from "./services/firebaseService";
import { onAuthStateChanged } from "firebase/auth";
import routes from "tempo-routes";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Check if profile setup is complete
        const profile = await getUserProfile(currentUser.uid);
        setProfileComplete(profile?.setupCompleted || false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Always call useRoutes, but only use the result if VITE_TEMPO is true
  const tempoRoutes = useRoutes(routes);
  const showTempoRoutes = import.meta.env.VITE_TEMPO === "true";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {/* Render Tempo routes if enabled */}
        {showTempoRoutes && tempoRoutes}

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                profileComplete ? (
                  <Home />
                ) : (
                  <Navigate to="/profile-setup" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile-setup"
            element={
              user ? (
                profileComplete ? (
                  <Navigate to="/" />
                ) : (
                  <ProfileSetup />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Add a route for Tempo storyboards */}
          {showTempoRoutes && <Route path="/tempobook/*" element={<></>} />}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
