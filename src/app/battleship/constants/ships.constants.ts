export const SHIPS: { size: number }[] = [
  { size: 4 },
  ...Array.from({ length: 2 }, () => ({ size: 3 })),
  ...Array.from({ length: 3 }, () => ({ size: 2 })),
  ...Array.from({ length: 4 }, () => ({ size: 1 })),
]
