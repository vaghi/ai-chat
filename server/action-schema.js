// actionSchema.js
export const AllowedActions = ["text", "ui_change"];
export const AllowedSubActions = ["none", "set_theme", "clear_cache"];

function isObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

export function validateActionResponse(obj) {
  const errors = [];

  if (!isObject(obj)) {
    return { ok: false, errors: ["Response is not a JSON object"] };
  }

  const { action, subaction, payload, meta } = obj;

  if (!AllowedActions.includes(action)) {
    errors.push(`Invalid "action": ${action}`);
  }
  if (!AllowedSubActions.includes(subaction)) {
    errors.push(`Invalid "subaction": ${subaction}`);
  }
  if (!isObject(payload)) {
    errors.push(`"payload" must be an object`);
  }

  // Text action requirements
  if (action === "text") {
    if (subaction !== "none") {
      errors.push(`"text" action must use subaction "none"`);
    }
    if (!payload || typeof payload.text !== "string") {
      errors.push(`"text" action requires payload.text (string)`);
    }
  }

  // UI change requirements
  if (action === "ui_change") {
    if (subaction === "set_theme") {
      if (!payload || (payload.theme !== "light" && payload.theme !== "dark")) {
        errors.push(`"set_theme" requires payload.theme = "light" | "dark"`);
      }
    }
    if (subaction === "clear_cache") {
      // no required fields, but payload must exist
      if (!isObject(payload))
        errors.push(`"clear_cache" needs an object payload`);
    }
  }

  if (meta !== undefined && !isObject(meta)) {
    errors.push(`"meta" must be an object if provided`);
  }

  return { ok: errors.length === 0, errors };
}

export function asSafeTextFallback(raw) {
  return {
    action: "text",
    subaction: "none",
    payload: { text: typeof raw === "string" ? raw : JSON.stringify(raw) },
  };
}
