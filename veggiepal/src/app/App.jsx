import AppProvider from "./provider";
import AppRoutes from "./routes";

function App() {
  return (
    <div className="relative min-h-screen">
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </div>
  );
}

export default App;