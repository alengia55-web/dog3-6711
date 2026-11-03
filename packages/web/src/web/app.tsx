import { Route, Switch, useLocation } from "wouter";
import Index from "./pages/index";
import Adopt from "./pages/adopt";
import Volunteer from "./pages/volunteer";
import Donate from "./pages/donate";
import DogProfile from "./pages/dog-profile";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import AdminDogs from "./pages/admin/dogs";
import AdminDogForm from "./pages/admin/dog-form";
import AdminApplications from "./pages/admin/applications";
import AdminSettings from "./pages/admin/settings";
import AdminStaff from "./pages/admin/staff";
import { Layout } from "./components/layout";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";

/** The back office renders on its own, without the public header and footer. */
function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dogs" component={AdminDogs} />
      <Route path="/admin/dogs/:id" component={AdminDogForm} />
      <Route path="/admin/applications" component={AdminApplications} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/staff" component={AdminStaff} />
    </Switch>
  );
}

/**
 * Everything under /admin is the back office and skips the public chrome.
 * Split on the path rather than a wildcard route so deep links such as
 * /admin/dogs/12 can never fall through to the public layout.
 */
function Routes() {
  const [location] = useLocation();
  if (location === "/admin" || location.startsWith("/admin/")) return <AdminRoutes />;
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/dogs/:slug" component={DogProfile} />
        <Route path="/adopt" component={Adopt} />
        <Route path="/volunteer" component={Volunteer} />
        <Route path="/donate" component={Donate} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <Provider>
      <Routes />
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
