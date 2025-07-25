// lib/interviewStore.ts

const interviewStore = new Map<string, string>();

export function saveInterview(id: string, content: string) {
  interviewStore.set(id, content);
}

export function getInterview(id: string) {
  return interviewStore.get(id);
}

export function deleteInterview(id: string) {
  interviewStore.delete(id);
}
