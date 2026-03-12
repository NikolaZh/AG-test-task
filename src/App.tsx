import { RouterProvider } from "react-router/dom";
import router from './routes.ts';
import AuthProvider from "./features/AuthProvider.tsx";

function App() {
  return (
    <main className="w-full bg-gray-200 min-h-screen">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </main>
  )
}

export default App