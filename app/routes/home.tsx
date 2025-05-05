// import type { Route } from "./+types/home";
import { ChatInterface } from "~/chat/ChatInterface";
import { ClientOnly } from "remix-utils/client-only";
export function meta() {
	return [
		{ title: "Health Mate Chat bot" },
		{ name: "description", content: "AI powered health assistant" },
	];
}

export default function Home() {
	return (
		<ClientOnly fallback={<div>Loading...</div>}>
			{()=><ChatInterface />}
		</ClientOnly>
	);
}
