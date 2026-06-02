type OpenAIResponseInput = {
  model: string;
  input: Array<{
    role: "user";
    content: Array<
      | { type: "input_text"; text: string }
      | { type: "input_image"; image_url: string }
    >;
  }>;
  text: {
    format: { type: "json_object" };
  };
};

export async function createOpenAIJsonResponse(input: OpenAIResponseInput): Promise<unknown> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  return response.json();
}
