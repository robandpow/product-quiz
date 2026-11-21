export const STORAGE_KEY = 'ekte-vare-session-v1';
export const VERSION = 1;

export function shuffled(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createSession(rounds, random = Math.random) {
  return { version: VERSION, view: 'quiz', roundIndex: 0, answers: [],
    orders: rounds.map(r => shuffled(r.products.map(p => p.id), random)),
    draft: { mode: 'items', selected: [] } };
}

export function canSubmit(draft) {
  if (draft.mode === 'unsure') return true;
  return draft.mode === 'none' || draft.selected.length > 0;
}

export function assess(round, answer) {
  const real = round.products.filter(p => p.real).map(p => p.id);
  const selected = answer.mode === 'items' ? answer.selected : [];
  const falseSelections = selected.filter(id => !real.includes(id));
  const missed = real.filter(id => !selected.includes(id));
  return { falseSelections, missed, realCount: real.length, selectedReal: selected.length - falseSelections.length,
    exact: answer.mode !== 'unsure' && falseSelections.length === 0 && missed.length === 0,
    unsure: answer.mode === 'unsure' };
}

export function summarize(rounds, answers) {
  return answers.reduce((total, a, i) => {
    const result = assess(rounds[i], a);
    total.conceptsSelected += result.falseSelections.length;
    total.realRejected += result.unsure ? 0 : result.missed.length;
    total.exactRounds += Number(result.exact);
    total.unsureRounds += Number(result.unsure);
    return total;
  }, { conceptsSelected: 0, realRejected: 0, exactRounds: 0, unsureRounds: 0 });
}

export function validateSession(value, rounds) {
  if (!value || value.version !== VERSION || !['intro','quiz','results'].includes(value.view)) return false;
  if (!Number.isInteger(value.roundIndex) || value.roundIndex < 0 || value.roundIndex >= rounds.length) return false;
  if (!Array.isArray(value.orders) || value.orders.length !== rounds.length || !Array.isArray(value.answers)) return false;
  if (value.answers.length > rounds.length || value.answers.length < value.roundIndex || value.answers.length > value.roundIndex + 1) return false;
  if (value.view === 'results' && value.answers.length !== rounds.length) return false;
  const validChoice = (choice, i, complete) => {
    if (!choice || !['items','none','unsure'].includes(choice.mode) || !Array.isArray(choice.selected)) return false;
    if (new Set(choice.selected).size !== choice.selected.length || !choice.selected.every(id => rounds[i].products.some(p => p.id === id))) return false;
    if (choice.mode !== 'items' && choice.selected.length) return false;
    return !complete || canSubmit(choice);
  };
  return value.orders.every((order,i) => Array.isArray(order) && order.length === 4 && new Set(order).size === 4 && order.every(id => rounds[i].products.some(p => p.id === id))) &&
    value.answers.every((a,i) => validChoice(a,i,true)) && validChoice(value.draft,value.roundIndex,false);
}

export function readSession(storage, rounds) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!validateSession(value, rounds)) return null;
    // Keep existing progress while dropping the retired confidence field.
    const choice = ({ mode, selected }) => ({ mode, selected });
    return { ...value, answers: value.answers.map(choice), draft: choice(value.draft) };
  }
  catch { return null; }
}
