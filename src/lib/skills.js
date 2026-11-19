/** Kelompokkan skill berdasarkan `group`, urutan mengikuti kemunculan pertama. */
export function groupSkills(list) {
  const map = new Map();
  list.forEach((skill) => {
    if (!map.has(skill.group)) map.set(skill.group, []);
    map.get(skill.group).push(skill);
  });
  return [...map.entries()].map(([group, items]) => ({ group, items }));
}
