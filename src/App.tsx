import { RouterProvider } from "react-router/dom";
import router from './routes.ts';

function App() {
  return (
    <main className="w-full bg-gray-200 min-h-screen">
      <RouterProvider router={router} />
    </main>
  )
}

export default App