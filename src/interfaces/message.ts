export interface Message {
  id: string;
  author: { id: string };
  content: string;
  createdAt: Date;
  editedAt?: Date;
}
