export * from './ui';
export * from './academic';
export { PageHero, Section } from './layout/PageHero';
export type { PageHeroProps, SectionProps } from './layout/PageHero';
export { Navbar } from './layout/Navbar';
export { Footer } from './layout/Footer';
export * from './features';
export { SchoolLogo } from './brand/SchoolLogo';
export type { SchoolLogoProps } from './brand/SchoolLogo';
export { FacebookIcon, WhatsAppIcon } from './brand/BrandIcons';
export { WelcomeSplash } from './brand/WelcomeSplash';
export type { WelcomeSplashProps } from './brand/WelcomeSplash';
export { ImagePlaceholder, ImageWithOverlay, ScrollHint } from './ui/ImagePlaceholder';
export { SpectralAIAssistant } from './ai/SpectralAIAssistant';

/* shadcn/ui primitives (Radix-based), restyled for this project's tokens. */
export {
  Badge,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Label,
  Input as ShadcnInput,
  Textarea as ShadcnTextarea,
  RadioGroup,
  RadioGroupItem,
} from './shadcn/primitives';
