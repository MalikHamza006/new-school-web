import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Send, User, Mail, Phone, GraduationCap } from 'lucide-react';
import { Button, Input, Select, Textarea } from '../ui';

export type InquiryType = 'admissions' | 'academics' | 'general' | 'campus-visit' | 'other';

export interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  studentName: string;
  inquiryType: InquiryType | '';
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export const inquiryTypeOptions = [
  { value: 'admissions', label: 'Admissions' },
  { value: 'academics', label: 'Academics' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'campus-visit', label: 'Campus Visit' },
  { value: 'other', label: 'Other' },
] as const;

const initialValues: ContactFormValues = {
  fullName: '',
  email: '',
  phone: '',
  studentName: '',
  inquiryType: '',
  message: '',
};

/** Validation rules. Kept outside the component so they are testable. */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Please enter at least 3 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  // Pakistani numbers are commonly 03xxxxxxxxx; landlines are also accepted.
  if (!values.phone.trim()) {
    errors.phone = 'Please enter a contact number.';
  } else if (!/^[+\d][\d\s()-]{9,19}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!values.inquiryType) {
    errors.inquiryType = 'Please select the type of your inquiry.';
  }

  const messageLength = values.message.trim().length;
  if (messageLength === 0) {
    errors.message = 'Please tell us how we can help.';
  } else if (messageLength < 15) {
    errors.message = 'Please add a little more detail (at least 15 characters).';
  } else if (messageLength > 1500) {
    errors.message = 'Please keep your message under 1500 characters.';
  }

  return errors;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

interface ContactFormProps {
  /**
   * Optional submit handler. When omitted the form runs in demo mode: it
   * validates, shows the success state, and clearly reports that no message
   * was transmitted. Wire this to your backend or form service to go live.
   */
  onSubmit?: (values: ContactFormValues) => Promise<void> | void;
  className?: string;
  compact?: boolean;
}

export function ContactForm({ onSubmit, className = '', compact = false }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({});
  const [status, setStatus] = useState<SubmitState>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const reduceMotion = useReducedMotion();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const field = name as keyof ContactFormValues;

    setValues((previous) => ({ ...previous, [field]: value }));

    // Re-validate a field only once it has been blurred, to avoid shouting
    // at the user while they are still typing their first character.
    if (touched[field]) {
      setErrors((previous) => ({ ...previous, [field]: validateContactForm({ ...values, [field]: value })[field] }));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = event.target.name as keyof ContactFormValues;
    setTouched((previous) => ({ ...previous, [field]: true }));
    setErrors((previous) => ({ ...previous, [field]: validateContactForm(values)[field] }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    setTouched(
      Object.keys(values).reduce<Partial<Record<keyof ContactFormValues, boolean>>>((acc, key) => {
        acc[key as keyof ContactFormValues] = true;
        return acc;
      }, {})
    );

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setStatusMessage('Please correct the highlighted fields and try again.');
      // Move focus to the first invalid control.
      const firstInvalid = event.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    setStatus('submitting');
    setStatusMessage('');

    if (onSubmit) {
      try {
        await onSubmit(values);
        setStatus('success');
        setStatusMessage('Thank you. Your inquiry has been submitted successfully.');
        setValues(initialValues);
        setTouched({});
      } catch (error) {
        setStatus('error');
        setStatusMessage(
          error instanceof Error
            ? error.message
            : 'Sorry, your inquiry could not be sent. Please try again or call the school directly.'
        );
      }
      return;
    }

    // Demo mode — no backend configured. Be explicit that direct contact is best.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus('success');
    setStatusMessage(
      'Inquiry form validated successfully. For immediate confirmation, please contact the school office at 042-37932284 or message our desk on WhatsApp.'
    );
    setValues(initialValues);
    setTouched({});
  };

  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className={`grid gap-5 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <Input
          label="Full Name"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
          placeholder="e.g. Ahmed Khan"
          autoComplete="name"
          required
          icon={<User className="h-4 w-4" />}
          maxLength={80}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
          inputMode="email"
          icon={<Mail className="h-4 w-4" />}
          maxLength={120}
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          placeholder="03XX XXXXXXX"
          autoComplete="tel"
          required
          inputMode="tel"
          icon={<Phone className="h-4 w-4" />}
          hint="The number you would like us to call back on."
          maxLength={24}
        />

        <Input
          label="Student's Name"
          name="studentName"
          value={values.studentName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.studentName}
          placeholder="Leave blank if not applicable"
          icon={<GraduationCap className="h-4 w-4" />}
          maxLength={80}
        />
      </div>

      <Select
        label="Inquiry Type"
        name="inquiryType"
        value={values.inquiryType}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.inquiryType}
        options={inquiryTypeOptions.map((option) => ({ ...option }))}
        placeholder="Select the type of your inquiry"
        required
        containerClassName="mt-5"
      />

      <Textarea
        label="Message"
        name="message"
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.message}
        placeholder="Please share the details of your inquiry, including the class or level you are asking about."
        required
        rows={5}
        maxLength={1500}
        containerClassName="mt-5"
        hint={`${values.message.trim().length} / 1500 characters`}
      />

      {/* Status feedback */}
      <div aria-live="polite" aria-atomic="true" className="mt-5 empty:mt-0">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' && (
            <motion.div
              key="success"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-green-900">{statusMessage}</p>
            </motion.div>
          )}

          {status === 'error' && statusMessage && (
            <motion.div
              key="error"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-amber-900">{statusMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="mt-6 w-full"
      >
        {isSubmitting ? 'Sending…' : 'Send Inquiry'}
        {!isSubmitting && <Send className="h-4 w-4" aria-hidden="true" />}
      </Button>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-muted">
        Required fields are marked with an asterisk. We only use your details to respond to this
        inquiry.
      </p>
    </form>
  );
}
