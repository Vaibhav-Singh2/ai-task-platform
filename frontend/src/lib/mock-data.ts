export type TaskStatus = "pending" | "running" | "success" | "failed";

export type TaskRecord = {
  id: string;
  title: string;
  operation: "uppercase" | "lowercase" | "reverse" | "word_count";
  status: TaskStatus;
  createdAt: string;
};

export const dashboardStats = {
  total: 1284,
  running: 12,
  completed: 1268,
  failed: 4,
};

export const tasks: TaskRecord[] = [
  {
    id: "AI-9823-X",
    title: "Neural Data Synthesis: Project Orion",
    operation: "word_count",
    status: "running",
    createdAt: "Apr 21, 2026 10:42",
  },
  {
    id: "AI-9819-A",
    title: "Quarterly Sentiment Audit",
    operation: "uppercase",
    status: "success",
    createdAt: "Apr 21, 2026 09:15",
  },
  {
    id: "AI-9815-R",
    title: "Predictive Logic Refinement",
    operation: "reverse",
    status: "failed",
    createdAt: "Apr 20, 2026 22:06",
  },
  {
    id: "AI-9812-K",
    title: "API Gateway Synthesis",
    operation: "lowercase",
    status: "pending",
    createdAt: "Apr 20, 2026 20:30",
  },
];

export const timeline = [
  {
    step: "Data Ingestion Complete",
    time: "10:42 AM",
    state: "success",
    detail:
      "Synchronized 4.2GB of raw telemetry data from redundant satellite nodes.",
  },
  {
    step: "Vectorization & Embedding",
    time: "10:45 AM",
    state: "success",
    detail:
      "Mapped hierarchical datasets into 1536-dimensional vector space.",
  },
  {
    step: "Heuristic Pattern Recognition",
    time: "Current",
    state: "running",
    detail: "Analyzing temporal shifts in asset distribution. Progress: 72%.",
  },
  {
    step: "Summary Generation",
    time: "Pending",
    state: "pending",
    detail:
      "Drafting final report with executive recommendations from synthesized signals.",
  },
] as const;
