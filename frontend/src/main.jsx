import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LandingScreen from "./screens/LandingScreen.jsx";
import FarmerRegisterScreen from "./screens/farmer-screens/FarmerRegisterScreen.jsx";
import FarmerLoginScreen from "./screens/farmer-screens/FarmerLoginScreen.jsx";
import FarmerDashboardScreen from "./screens/farmer-screens/FarmerDashboardScreen.jsx";
import FarmerProfileScreen from "./screens/farmer-screens/FarmerProfileScreen.jsx";
import FarmerForgotPasswordScreen from "./screens/farmer-screens/FarmerForgotPasswordScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LandingScreen />} />
      <Route path="/farmer/register" element={<FarmerRegisterScreen />} />
      <Route path="/farmer/login" element={<FarmerLoginScreen />} />
      <Route
        path="farmer/forgot-password"
        element={<FarmerForgotPasswordScreen />}
      />
      <Route path="/farmer/dashboard" element={<FarmerDashboardScreen />} />
      <Route path="/farmer/profile" element={<FarmerProfileScreen />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
