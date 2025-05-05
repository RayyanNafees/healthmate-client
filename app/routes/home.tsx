// import type { Route } from "./+types/home";
import {ChatInterface} from "~/chat/ChatInterface";

export function meta() {
	return [
		{ title: "Health Mate Chat bot" },
		{ name: "description", content: "AI powered health assistant" },
	];
}

export default function Home() {
	if (typeof document==="undefined") return null;
	return <ChatInterface />;
}
