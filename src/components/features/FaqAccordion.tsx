import { AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../shadcn/primitives';
import type { Faq } from '../../data/faqs';

interface FaqAccordionProps {
  items: Faq[];
  className?: string;
  /** Allow several panels open at once. */
  allowMultiple?: boolean;
  defaultOpenId?: string;
}

/**
 * FAQ accordion built on the shadcn/Radix Accordion.
 *
 * Radix owns the behaviour that is easy to get subtly wrong: it wires
 * `aria-expanded` and `aria-controls`, moves focus correctly, and supports
 * Home/End and arrow-key navigation between headers. This replaces a hand-rolled
 * button list that only had the `aria-expanded` half of that.
 *
 * Unconfirmed answers are still visibly marked, so a holding response is never
 * mistaken for published policy.
 *
 * The `type` prop is what implements `allowMultiple`: Radix's `collapsible`
 * mode already behaves as "one open at a time".
 */
export function FaqAccordion({
  items,
  className = '',
  allowMultiple = false,
  defaultOpenId,
}: FaqAccordionProps) {
  // Radix types `single` and `multiple` as mutually exclusive prop shapes, so
  // the union has to be resolved in JSX rather than passed through as a
  // variable — otherwise TypeScript widens `type` and rejects both variants.
  const shared = {
    collapsible: true,
    className: `flex flex-col gap-3 ${className}`,
  } as const;

  const panels = items.map((item) => (
    <AccordionItem key={item.id} value={item.id}>
      <AccordionTrigger>{item.question}</AccordionTrigger>

      <AccordionContent>
        <p>{item.answer}</p>

        {!item.confirmed && (
          <p className="mt-3 inline-flex items-start gap-1.5 rounded-md bg-gold/10 px-3 py-2 text-xs font-medium leading-relaxed text-gold-dark">
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            This answer is pending confirmation from the school. Please contact the
            office for accurate information.
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  ));

  return allowMultiple ? (
    <Accordion type="multiple" defaultValue={defaultOpenId ? [defaultOpenId] : []} {...shared}>
      {panels}
    </Accordion>
  ) : (
    <Accordion type="single" defaultValue={defaultOpenId} {...shared}>
      {panels}
    </Accordion>
  );
}
