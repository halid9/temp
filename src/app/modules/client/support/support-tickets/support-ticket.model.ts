export interface SupportTicketModel {
  _id: number;
  customerEmail?: string;
  agentName?: string;
  channelId: string;
  status: string;
  isSelected?:any;
  topic: string;
  description: string;
  customerId?:number;
}


export interface CreateTicketDTO {
  _id: number;
  customerEmail?: string;
  agentId?: string;
  agentName?: string;
  channelId: string;
  status: string;
  topic: string;
  description: string;
  customerId?:number;
}


