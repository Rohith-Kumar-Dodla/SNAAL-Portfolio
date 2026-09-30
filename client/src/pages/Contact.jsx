import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
} from "lucide-react";
import { useContent } from "../context/ContentContext";
import { submitContact, submitSiteVisit } from "../services/api";
import {
  Button,
  PageHeader,
  PageMotion,
  Section,
  inputClass,
} from "../components/ui";

function Field({
  label,
  name,
  type = "text",
  required = false,
  errors,
  children,
  as = "input",
  ...props
}) {
  const id = `field-${name}`;
  const error = errors[name];
  const Component = as;
  return (
    <label className="block text-sm font-semibold" htmlFor={id}>
      {label}
      {required && (
        <span className="text-red-600" aria-hidden="true">
          {" "}
          *
        </span>
      )}
      {children || (
        <Component
          id={id}
          name={name}
          type={type}
          className={`${inputClass} ${error ? "border-red-400 ring-2 ring-red-100" : ""}`}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}{" "}
      {error && (
        <span
          id={`${id}-error`}
          className="mt-2 block text-sm font-medium text-red-700"
        >
          {error}
        </span>
      )}
    </label>
  );
}
const validators = {
  email: (v) => /^\S+@\S+\.\S+$/.test(v) || "Enter a valid business email.",
  phone: (v) => /^[-+()\d\s]{7,20}$/.test(v) || "Enter a valid phone number.",
  pincode: (v) => /^\d{6}$/.test(v) || "Enter a valid 6-digit PIN code.",
};
function useForm(required, extra = {}, send) {
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const next = {};
    required.forEach((key) => {
      if (!String(data[key] || "").trim())
        next[key] = "This field is required.";
    });
    Object.entries(extra).forEach(([key, fn]) => {
      if (data[key] && fn(data[key]) !== true) next[key] = fn(data[key]);
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await send(data);
      setConfirmation(result.message);
      setValidated(true);
    } catch (error) {
      const fields = error.response?.data?.error?.fields?.fieldErrors || {};
      setErrors(Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value[0]])));
      setSubmitError(error.response?.data?.error?.message || "We could not submit the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return { errors, validated, submit, setValidated, submitting, submitError, confirmation };
}
function ServiceSelect({ errors }) {
  const { services } = useContent();
  return (
    <Field label="Service interested in" name="service" errors={errors}>
      <select
        id="field-service"
        name="service"
        className={inputClass}
        defaultValue=""
      >
        <option value="">Select a service</option>
        {services.map((x) => (
          <option key={x.slug} value={x.slug}>
            {x.title}
          </option>
        ))}
      </select>
    </Field>
  );
}
export default function Contact({ mode }) {
  return mode === "visit" ? <SiteVisit /> : <ContactForm />;
}
function ContactForm() {
  const { errors, validated, submit, setValidated, submitting, submitError, confirmation } = useForm(
    ["name", "email", "message"],
    { email: validators.email },
    submitContact,
  );
  return (
    <PageMotion>
      <PageHeader
        path="/contact"
        eyebrow="Contact"
        title="Let’s make the next step clear."
        copy="Share the context behind what you are planning, improving or trying to solve."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <aside>
            <p className="eyebrow">Start here</p>
            <h2 className="h2 mt-4">
              A useful first conversation needs context, not a perfect brief.
            </h2>
            <p className="mt-6 leading-7 text-muted">
              Tell us what is changing, who the product should help and what a
              better outcome would look like.
            </p>
            <div className="mt-10 space-y-5 border-t border-line pt-6 text-sm">
              <p className="flex gap-3">
                <Clock3 className="text-brand-600" size={19} />
                <span>
                  <b className="block text-ink">Business hours</b>
                  <span className="text-muted">To be confirmed by SNAAL</span>
                </span>
              </p>
              <p className="flex gap-3">
                <Building2 className="text-brand-600" size={19} />
                <span>
                  <b className="block text-ink">Company contact</b>
                  <span className="text-muted">
                    Verified details will be published after approval
                  </span>
                </span>
              </p>
            </div>
          </aside>
          <FormFrame validated={validated} confirmation={confirmation} onReset={() => setValidated(false)}>
            <form className="grid gap-6" onSubmit={submit} noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" name="name" required errors={errors} />
                <Field label="Company" name="company" errors={errors} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Business email"
                  name="email"
                  type="email"
                  required
                  errors={errors}
                />
                <Field label="Phone" name="phone" type="tel" errors={errors} />
              </div>
              <ServiceSelect errors={errors} />
              <Field
                label="Message"
                name="message"
                required
                errors={errors}
                as="textarea"
                rows="6"
              />
              <div>
                <Button type="submit" disabled={submitting} aria-label="Validate enquiry">
                  {submitting ? "Sending…" : "Send enquiry"} <Send size={16} />
                </Button>
                {submitError && <p className="mt-3 text-sm font-medium text-red-700" role="alert">{submitError}</p>}
              </div>
            </form>
          </FormFrame>
        </div>
      </Section>
    </PageMotion>
  );
}
function SiteVisit() {
  const required = [
    "name",
    "company",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
    "description",
    "date",
    "time",
  ];
  const { errors, validated, submit, setValidated, submitting, submitError, confirmation } = useForm(required, { email: validators.email, phone: validators.phone, pincode: validators.pincode }, data => submitSiteVisit({name:data.name,company:data.company,email:data.email,phone:data.phone,companyAddress:data.address,city:data.city,state:data.state,pinCode:data.pincode,service:data.service,projectDescription:data.description,preferredVisitDate:data.date,preferredTime:data.time,expectedAttendees:data.attendees?Number(data.attendees):undefined,additionalNotes:data.notes||undefined}));
  const today = new Date().toISOString().split("T")[0];
  return (
    <PageMotion>
      <PageHeader
        path="/book-site-visit"
        eyebrow="Book a site visit"
        title="Bring the conversation to your business."
        copy="Share the operational context, location and preferred timing for an in-person discussion."
      />
      <Section>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              [MapPin, "Your location"],
              [CalendarDays, "Preferred timing"],
              [Building2, "Your requirement"],
            ].map(([Icon, text], i) => (
              <div
                key={text}
                className="flex items-center gap-3 border-t border-line py-4 text-sm font-semibold"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={18} />
                </span>
                <span>
                  0{i + 1} · {text}
                </span>
              </div>
            ))}
          </div>
          <FormFrame validated={validated} confirmation={confirmation} onReset={() => setValidated(false)}>
            <form className="grid gap-10" onSubmit={submit} noValidate>
              <FormSection title="Contact">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name" name="name" required errors={errors} />
                  <Field
                    label="Company"
                    name="company"
                    required
                    errors={errors}
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    errors={errors}
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    required
                    errors={errors}
                  />
                </div>
              </FormSection>
              <FormSection title="Location">
                <Field
                  label="Company address"
                  name="address"
                  required
                  errors={errors}
                />
                <div className="grid gap-6 sm:grid-cols-3">
                  <Field label="City" name="city" required errors={errors} />
                  <Field label="State" name="state" required errors={errors} />
                  <Field
                    label="PIN code"
                    name="pincode"
                    required
                    errors={errors}
                    inputMode="numeric"
                  />
                </div>
              </FormSection>
              <FormSection title="Requirement">
                <ServiceSelect errors={errors} />
                <Field
                  label="Project / requirement description"
                  name="description"
                  required
                  errors={errors}
                  as="textarea"
                  rows="5"
                />
                <div className="grid gap-6 sm:grid-cols-3">
                  <Field
                    label="Preferred visit date"
                    name="date"
                    type="date"
                    min={today}
                    required
                    errors={errors}
                  />
                  <Field
                    label="Preferred time"
                    name="time"
                    type="time"
                    required
                    errors={errors}
                  />
                  <Field
                    label="Expected attendees"
                    name="attendees"
                    type="number"
                    min="1"
                    errors={errors}
                  />
                </div>
                <Field
                  label="Additional notes"
                  name="notes"
                  errors={errors}
                  as="textarea"
                  rows="4"
                />
              </FormSection>
              <div>
                <Button type="submit" disabled={submitting} aria-label="Validate request">
                  {submitting ? "Sending…" : "Request a site visit"} <ArrowRight size={16} />
                </Button>
                {submitError && <p className="mt-3 text-sm font-medium text-red-700" role="alert">{submitError}</p>}
              </div>
            </form>
          </FormFrame>
        </div>
      </Section>
    </PageMotion>
  );
}
function FormSection({ title, children }) {
  return (
    <fieldset className="grid gap-6">
      <legend className="font-display text-xl font-bold">{title}</legend>
      <div className="h-px bg-line" />
      {children}
    </fieldset>
  );
}
function FormFrame({ validated, confirmation, onReset, children }) {
  if (validated)
    return (
      <div
        className="grid min-h-96 place-items-center rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center"
        role="status"
      >
        <div>
          <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
          <h2 className="h3 mt-5">Thank you.</h2>
          <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
            {confirmation}
          </p>
          <Button variant="secondary" className="mt-7" onClick={onReset}>
            Submit another
          </Button>
        </div>
      </div>
    );
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10">
      {children}
    </div>
  );
}
