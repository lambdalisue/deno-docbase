export type AttachmentId = string;

export type Attachment = {
  id: AttachmentId;
  name: string;
  size: number;
  url: string;
  markdown: string;
  createdAt: string;
};
