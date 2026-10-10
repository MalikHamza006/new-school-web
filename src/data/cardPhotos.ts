import type { HeroImageId } from './images';

/**
 * Which official photograph each content card shows.
 *
 * Content cards — programmes, features, achievements — take an optional `image`
 * so the school can point a specific card at a specific photograph later. Until
 * then this spreads the four published photographs around a grid in order,
 * rather than letting one page show the same picture four times running.
 *
 * WHY ONLY FOUR
 * -------------
 * The school has published exactly four photographs of the campus. A grid of
 * eight cards is therefore going to show those four more than once, and that is
 * stated in the code rather than hidden: cycling the official set is the honest
 * option, because the alternative — borrowing stock images of other schools —
 * would be a false claim about this campus. Once a real photo library exists,
 * pass a specific `photo` per card and the repetition disappears with no change
 * to any component.
 *
 * This lives in `data/` rather than next to the card components because it is
 * data selection, not rendering — and keeping it out of a component file means
 * those files only export components, which is what React Fast Refresh needs.
 */
const CARD_PHOTO_ORDER: readonly HeroImageId[] = ['campusA', 'campusB', 'campusC', 'campusD'];

export function cardPhotoFor(index: number): HeroImageId {
  // Modulo wraps safely: `index` grows without bound as cards are added, and
  // a guarded modulo never runs off the end of the list.
  const safe = Math.abs(Math.trunc(index)) % CARD_PHOTO_ORDER.length;
  return CARD_PHOTO_ORDER[safe];
}
