import { Home, Search } from "lucide-react";
import Index from "./pages/Index.jsx";
import SearchResult from "./pages/SearchResult.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Search Result",
    to: "/search/:word",
    icon: <Search className="h-4 w-4" />,
    page: <SearchResult />,
  },
];
