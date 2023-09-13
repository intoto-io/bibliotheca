const defaultColors = ["#CE1836", "#1F81C6", "#A3A948", "#EDB92E"];

function colorByIndex(index: number): string {
  return defaultColors[index % defaultColors.length];
}

export default colorByIndex;
