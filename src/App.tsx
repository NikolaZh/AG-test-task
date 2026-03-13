import { RouterProvider } from "react-router/dom";
import { Toaster } from "@/components/ui/sonner";
import router from './app/router/routes.ts';
import AuthProvider from "./app/providers/AuthProvider.tsx";

function App() {
  return (
    <main className="min-h-screen bg-muted-foreground/5">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
       <Toaster />
    </main>
  )
}

export default App