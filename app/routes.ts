import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/timer", "routes/timer.tsx"),
] satisfies RouteConfig;
