export const MESSAGE_STATUSES = ["scheduled", "sent"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export const MESSAGE_STATUS_LABEL: Record<MessageStatus, string> = {
  scheduled: "Agendada",
  sent: "Enviada",
};

export type Recipient = {
  id: string;
  name: string;
  phone: string;
};

export type Message = {
  id: string;
  tenantId: string;
  connectionId: string;
  body: string;
  recipients: Recipient[];
  status: MessageStatus;
  scheduledAt: Date;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
