import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div>
      <h1>Welcome to Melosys Skjema</h1>
      <p>This is the home page of your React application.</p>
    </div>
  ),
});
