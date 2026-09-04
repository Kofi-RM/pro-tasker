// TaskType describes the shape of a task object returned by the API.
export type TaskStatus = "to do" | "in progress" | "complete";

export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
};

export type TaskType = TaskInput & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};
