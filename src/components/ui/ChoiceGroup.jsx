import { cn } from '@/lib/cn';
import { FieldMessage } from './Field';

/**
 * Pilihan tunggal berbentuk "chip" (radio native → aksesibel lewat keyboard).
 * options: [{ key, label, hint? }]
 */
export default function ChoiceGroup({ id, name, legend, options, value, onChange, onBlur, error, required, fieldName }) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={error ? 'true' : undefined}>
      <legend className="label text-ink">
        {legend}
        {required && <span aria-hidden> *</span>}
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt, i) => (
          <label key={opt.key} className="group/choice relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.key}
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
              onBlur={onBlur}
              required={required}
              data-field={i === 0 ? fieldName : undefined}
              className="peer sr-only"
            />
            <span
              className={cn(
                'flex h-12 items-center justify-center border px-3 font-mono text-[11px] uppercase tracking-[0.12em]',
                'transition-colors duration-300 ease-editorial',
                'border-line-strong text-ink-soft group-hover/choice:border-ink group-hover/choice:text-ink',
                'peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper',
                'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink',
                error && 'border-ink',
              )}
              title={opt.hint}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      <FieldMessage id={id} error={error} />
    </fieldset>
  );
}
