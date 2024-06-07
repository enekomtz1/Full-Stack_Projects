/*
- This code defines the main application component for a React application.
- It sets up routing using React Router DOM.
- It conditionally renders components based on user authentication.
- It uses Apollo Client to fetch the authenticated user data.
- It displays a header and toast notifications conditionally.
*/

import { Navigate, Route, Routes } from "react-router-dom"; // Importing necessary components from react-router-dom for routing
import HomePage from "./pages/HomePage"; // Importing the HomePage component
import LoginPage from "./pages/LoginPage"; // Importing the LoginPage component
import SignUpPage from "./pages/SignUpPage"; // Importing the SignUpPage component
import TransactionPage from "./pages/TransactionPage"; // Importing the TransactionPage component
import NotFoundPage from "./pages/NotFoundPage"; // Importing the NotFoundPage component
import Header from "./components/ui/Header"; // Importing the Header component
import { useQuery } from "@apollo/client"; // Importing the useQuery hook from Apollo Client
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query"; // Importing the query to get the authenticated user
import { Toaster } from "react-hot-toast"; // Importing Toaster for toast notifications

function App() {
  // Main application component

  const { loading, data } = useQuery(GET_AUTHENTICATED_USER); 
  // Using Apollo Client's useQuery hook to fetch authenticated user data

  if (loading) return null;
  // If the query is still loading, return null to avoid rendering

  return (
    <>
      {data?.authUser && <Header />}
      {/* Conditionally render the Header component if user is authenticated */}

      <Routes>
        {/* Define application routes */}
        <Route path='/' element={data.authUser ? <HomePage /> : <Navigate to='/login' />} />
        {/* Home route, redirects to login if user is not authenticated */}

        <Route path='/login' element={!data.authUser ? <LoginPage /> : <Navigate to='/' />} />
        {/* Login route, redirects to home if user is authenticated */}

        <Route path='/signup' element={!data.authUser ? <SignUpPage /> : <Navigate to='/' />} />
        {/* SignUp route, redirects to home if user is authenticated */}

        <Route path='/transaction/:id' element={data.authUser ? <TransactionPage /> : <Navigate to='/login' />} />
        {/* Transaction route, redirects to login if user is not authenticated */}

        <Route path='*' element={<NotFoundPage />} />
        {/* Catch-all route for undefined paths, renders NotFoundPage */}
      </Routes>

      <Toaster />
      {/* Render the Toaster component for toast notifications */}
    </>
  );
}

export default App;
// Export the App component as the default export
