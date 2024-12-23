// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NetworkProvider } from "./contexts/NetworkContext";
import { WalletProvider } from "./contexts/WalletContext";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.tsx";
import { Toaster } from "./components/ui/toaster.tsx";


// Dark mode setup
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <NetworkProvider>
        <WalletProvider>
          <App />
          <Toaster />
        </WalletProvider>
      </NetworkProvider>
    </ErrorBoundary>
  </StrictMode>
);
