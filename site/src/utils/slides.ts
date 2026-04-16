export interface SlideInfo {
  id: string;
  title: string;
  part: number;
  slideNumber: number;
}

/**
 * Group slides by part number and return the sorted list of parts.
 */
export function groupSlidesByPart(slides: SlideInfo[]): {
  slidesByPart: Record<number, SlideInfo[]>;
  parts: number[];
} {
  const slidesByPart = slides.reduce(
    (acc, slide) => {
      if (!acc[slide.part]) {
        acc[slide.part] = [];
      }
      acc[slide.part].push(slide);
      return acc;
    },
    {} as Record<number, SlideInfo[]>
  );

  const parts = Object.keys(slidesByPart)
    .map(Number)
    .sort((a, b) => a - b);

  return { slidesByPart, parts };
}
