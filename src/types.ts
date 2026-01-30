export type Priority = 'Low' | 'Normal' | 'High' | 'Critical';

export type Status = 
  | 'On Hold' 
  | 'To Do' 
  | 'In Progress' 
  | 'Done' 
  | 'To Estimate' 
  | 'Pending Approval' 
  | 'Ready to Test';

export interface Task {
  id: string;
  name: string;
  backlogUrl: string;
  sprint: {
    start: string;
    end: string;
  };
  priority: Priority;
  status: Status;
  hours: number;
  estimate: number;
  spent: number; // Calculated field: hours * hourlyRate
}

export interface TaskList {
  id: string;
  name: string;
  isExpanded: boolean;
  tasks: Task[];
}

export interface Project {
  name: string;
  credits: number;
  hourlyRate: number;
  lists: TaskList[];
}
