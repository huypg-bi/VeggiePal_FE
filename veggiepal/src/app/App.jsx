import bgSiteFrame from "@/assets/img/bg_site_frame.png";
import AppProvider from "./provider";
import AppRoutes from "./routes";

function App() {
  return (
    <div className="relative min-h-screen">
      {/* <div className="fixed inset-0 -z-10" aria-hidden="true">
        <img
          src={bgSiteFrame}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div> */}

      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </div>
  );
}

export default App;