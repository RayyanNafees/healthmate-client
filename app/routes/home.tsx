import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "Health Mate Chat bot" },
    { name: "description", content: "AI powered health assistant" },
  ];
}

export default function Home() {
  return <Welcome />;
}
