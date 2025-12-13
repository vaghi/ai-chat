import { createChat } from "./groq-client.js";

/**
 * Parses a user prompt to extract style modifications for specific components.
 * Returns: { component: string, styles: Record<string, string> }
 */
export async function generateStyleUpdate(userPrompt) {
  const system = `
You are a CSS-in-JS style generator.
The user wants to modify the style of a component.
Allowed components:
- "main" (the main app background/container)
- "title" (the page heading)
- "chat" (the chat message list area)
- "input" (the text input field)

Instructions:
1. Identify the target component from the user prompt.
2. Extract the style changes implied by the user (colors, fonts, borders, etc.).
3. Convert them to valid React-style camelCase CSS properties (e.g., "backgroundColor", "fontSize").
4. Return a JSON object with "component" and "styles".

If the component is not one of the allowed list, pick the closest match or default to "main".
If no styles are clear, return empty styles.

Example Output:
{
  "component": "title",
  "styles": {
    "color": "pink",
    "fontSize": "3rem"
  }
}

Only output JSON.
`.trim();

  try {
    const data = await createChat({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0,
      max_tokens: 200,
    });

    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    
    // Validate component
    const validcomponents = ["main", "title", "chat", "input"];
    let component = parsed.component;
    if (!validcomponents.includes(component)) {
       component = "main"; // Fallback
    }

    return {
      component,
      styles: parsed.styles || {}
    };
  } catch (e) {
    console.error("Style generation failed:", e);
    return { component: "main", styles: {} };
  }
}
