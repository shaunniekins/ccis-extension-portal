interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

interface Session {
  id: String;
  sessionToken: string;
  userId: string;
  expires: string;
}
interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  accounts: Account[];
  sessions: Session[];
}

interface Partner {
  id: string;
  name: string;
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  partnerId: string;
  partner: Partner;
  title: string;
  description?: string;
  projectLeader?: string;
  proponents?: string;
  dateStarted?: string;
  dateCompletion?: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  projectId: string;
  project: Project;
  fileUrl: string;
  category: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}
