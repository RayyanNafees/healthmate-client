import { Pinecone } from "@pinecone-database/pinecone";
import type { ActionFunctionArgs } from "react-router";

const chatbot = "medbot-chat";
const _query =
	"I am feeling sick and tired and have a headache. What should I do?";
const systemPrompt = `You are an advanced medical chatbot trained on books of medicine and 
are responsible for correctly diagnosing the patient after understanding their conditions
and symptoms they tell. And as a professional u are supposed to ask them follow up questions
for further insights into their conditions so they can be diagnosed correctly.
It is a responsible job and may decide someone's lief and death so there's no room for AI creativity
or risk of halluscinations. Exactly read as the book suggest and if you fing the patient's case is bigger than
your knowledgebase can handle then please identify that and tell the patient asking him politely if you should be
signed up for a video call meeting appointment with a real doctor, but do not guess the conditions yourself that may lead to misdiagnosis
until thoroughly investigating the patient condition by asking followup questions, and then decide based on the provided context
If no context is provided then proceed with proper medication and also do include the questions that may further improve the diganosis if there
is a chanceof it in your knowledge base. Else most probably identify the knowlegde gaps and ask the user to set up a video call meeting appointment
of the patient with an actual medical professional doctor `;

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) throw `API key not found apiKey=${apiKey}`;

const pc = new Pinecone({ apiKey });
const assistant = pc.Assistant(chatbot);

type History = Array<{ role: "user" | "assistant"; content: string }>;

export const resp = async (query: string = _query, history: History = []) =>
	await assistant.chat({
		messages: [
			{
				role: "assistant",
				content: systemPrompt,
			},
			...history,
			{
				role: "user",
				content: query,
			},
		],
	});
const respStream = async (query: string = _query, history: History = []) =>
	await assistant.chatStream({
		messages: [
			{
				role: "assistant",
				content: systemPrompt,
			},
			...history,
			{
				role: "user",
				content: query,
			},
		],
	});

// console.log(resp.message?.content);

// const getJSON = (obj: string) => {
// 	try {
// 		return JSON.parse(obj);
// 	} catch (e) {
// 		return [];
// 	}
// };

// const sendReq = async (c) => {
// 	const query = c.req.query("q") ?? _query;
// 	const history = getJSON(c.req.query("history") ?? "[]") ?? [];
// 	const answer = await resp(query, history);
// 	return c.text(
// 		answer.message?.content ??
// 			"I failed to understand your query at the moment, please kindly rephrase it!",
// 	);
// };

export async function action({ request: req }: ActionFunctionArgs) {
	try {
		const { message, sessionId, history = [] } = await req.json();

		if (!message) {
			return Response.json({ error: "Message is required" }, { status: 400 });
		}

		// Start a chat and send message
		// const chat = model.startChat();
		// const result = await chat.sendMessage(message);
		const response = await resp(message, history).then(
			(r) => r.message?.content,
		);
		// const response = result.response;
		// const responseText = response.text();

		// Return the response
		return Response.json({
			response, //: responseText,
			sessionId,
		});
	} catch (error) {
		console.error("Error in chat API:", error);
		return Response.json({
			response:
				"I failed to understand your query at the moment, please kindly rephrase it!",
			sessionId: 500,
		});
	}
}