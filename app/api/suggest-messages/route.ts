import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: "anthropic/claude-sonnet-4.5",
      system: `
You are an AI assistant that generates anonymous message suggestions.

Generate exactly 3 different open-ended and engaging questions that users can send anonymously.

Rules:
- Return only the 3 questions.
- Each question should be on a new line.
- Keep them friendly and conversational.
- Do not number the questions.
- Do not include any introduction or explanation.
`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error suggesting messages:', error);

    return Response.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      {
        status: 500,
      }
    );
  }
}