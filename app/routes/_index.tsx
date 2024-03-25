import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import styles from "~/styles/home.css";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
	<main id="content">
		<h1>Palingen Workspace</h1>
		<p id="cta">
			<Link to="/map">Map!</Link>
		</p>
		<Outlet/>
	</main>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
