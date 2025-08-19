import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div style={{ padding: "1rem" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link style={{ marginRight: "1rem" }} to="/">
            Home
          </Link>
          <Link to="/about">About</Link>
        </nav>
        <hr />
        <Outlet />
      </div>
    </>
  ),
});
