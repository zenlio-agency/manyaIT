import type { StringRule } from "sanity";
import { noBannedWords } from "./validation";

/**
 * Validation for a string or text field of website copy: optionally
 * required, and always warned about banned words.
 */
export const copy =
  (required = false) =>
  (rule: StringRule) =>
    required
      ? [rule.required(), rule.custom(noBannedWords).warning()]
      : rule.custom(noBannedWords).warning();
