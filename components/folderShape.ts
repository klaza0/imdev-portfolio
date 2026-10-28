/**
 * Rounded rectangle whose top edge is raised (y = 0) between `highFrom` and `highTo`
 * and dropped by `drop` everywhere else, joined by smooth S-curves of width `s`.
 */
export function folderPath(w: number, h: number, highFrom: number, highTo: number, drop: number, r = 22, s = 52) {
  const leftY = highFrom <= 0 ? 0 : drop;
  const rightY = highTo >= w ? 0 : drop;
  let d = `M0 ${leftY + r}A${r} ${r} 0 0 1 ${r} ${leftY}`;
  if (highFrom > 0) {
    d += `L${highFrom - s} ${drop}C${highFrom - s / 2} ${drop} ${highFrom - s / 2} 0 ${highFrom} 0`;
  }
  if (highTo < w) {
    d += `L${highTo} 0C${highTo + s / 2} 0 ${highTo + s / 2} ${drop} ${highTo + s} ${drop}`;
  }
  d += `L${w - r} ${rightY}A${r} ${r} 0 0 1 ${w} ${rightY + r}`;
  d += `L${w} ${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}L${r} ${h}A${r} ${r} 0 0 1 0 ${h - r}Z`;
  return d;
}
