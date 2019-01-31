
export interface OrganisationDetail {
  is_vendor: boolean;
  is_consumer: boolean;
  is_repositive: boolean;

  organisation_name: string; // from orgs domain
  organisation_type: string; // used to compute above booleans
  organisation_id: string; // UUID
}

export interface UserDetail {
  name: string; // Comes from the accounts domain
  user_id: string; // Comes from the organisations domain
  organisation?: OrganisationDetail;
  organisation_id: string;
  avatar_url?: string;
}

export interface MessageDetail { // Aggregated by message sent events
  from: UserDetail;
  thread_id: string;
  message: string;
  time: string; // datetime
}

export interface Conversation {
  active?: boolean;
  conversation_id: string; // UUID used to aggregate conversation threads
  topic: string;
  members: UserDetail[]; // Get other members filter(user => user.user_id != me.user_id)
  messages: MessageDetail[];
}
