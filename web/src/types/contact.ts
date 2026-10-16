export type Contact = {
  id: string;
  tenantId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactInput = Pick<Contact, "name" | "phone">;
