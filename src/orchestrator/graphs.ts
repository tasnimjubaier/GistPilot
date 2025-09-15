import { buildLinearGraph } from "./engine";
import * as N from "./nodes";

export const OutlineDraftGraph = buildLinearGraph(
  {
    QueryPlanner: N.QueryPlanner,
    WebIntel: N.WebIntel,
    OutlineSynth: N.OutlineSynth,
  },
  ["QueryPlanner", "WebIntel", "OutlineSynth"]
);

export const LessonPipelineGraph = buildLinearGraph(
  {
    Retrieve: N.Retrieve,
    Rerank: N.Rerank,
    ComposeLesson: N.ComposeLesson,
    CitationCheck: N.CitationCheck,
    SaveLesson: N.SaveLesson,
  },
  ["Retrieve", "Rerank", "ComposeLesson", "CitationCheck", "SaveLesson"]
);

export const ChatRagGraph = buildLinearGraph(
  {
    Retrieve: N.Retrieve,
    Rerank: N.Rerank,
    ComposeLesson: N.ComposeLesson, // doubles as chat answer
  },
  ["Retrieve", "Rerank", "ComposeLesson"]
);
