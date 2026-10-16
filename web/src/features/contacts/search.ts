import type { Contact } from "../../types/contact";

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export const matchesSearch = (contact: Contact, term: string) => {
  const text = fold(term);
  if (!text) return true;
  const digits = text.replace(/\D/g, "");
  return (
    fold(contact.name).includes(text) ||
    (digits.length > 0 && contact.phone.includes(digits))
  );
};
