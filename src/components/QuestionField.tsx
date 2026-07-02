import type { DiagnosticQuestion } from '../types';

type QuestionFieldProps = {
  question: DiagnosticQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
};

function getOtherText(value: string | string[]): string {
  if (!Array.isArray(value)) return '';
  const other = value.find((v) => v.startsWith('Другое:'));
  return other ? other.replace(/^Другое:\s*/, '') : '';
}

function getSelectedWithoutOther(value: string | string[]): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => !v.startsWith('Другое:'));
}

export function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const { type, text, hint, placeholder, options = [], required } = question;

  if (type === 'short') {
    return (
      <div className="form-group">
        <label className={`form-label ${required ? 'form-label--required' : ''}`}>{text}</label>
        <input
          type="text"
          className="form-input"
          dir="ltr"
          value={typeof value === 'string' ? value : ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  if (type === 'long') {
    return (
      <div className="form-group">
        <label className={`form-label ${required ? 'form-label--required' : ''}`}>{text}</label>
        <textarea
          className="form-textarea"
          dir="ltr"
          value={typeof value === 'string' ? value : ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  if (type === 'single') {
    const selected = typeof value === 'string' ? value : '';
    return (
      <div className="form-group">
        <label className={`form-label ${required ? 'form-label--required' : ''}`}>{text}</label>
        <div className="radio-group">
          {options.map((option) => (
            <label key={option} className="radio-item">
              <input
                type="radio"
                name={question.id}
                checked={selected === option}
                onChange={() => onChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  if (type === 'multiple' || type === 'multiple-with-other') {
    const selected = Array.isArray(value) ? getSelectedWithoutOther(value) : [];
    const otherText = Array.isArray(value) ? getOtherText(value) : '';
    const hasOther = selected.includes('Другое') || (type === 'multiple-with-other' && otherText.length > 0);

    const updateMultiple = (option: string, checked: boolean) => {
      let next = checked ? [...selected, option] : selected.filter((s) => s !== option);
      next = [...new Set(next)];
      if (type === 'multiple-with-other') {
        const other = otherText.trim();
        if (next.includes('Другое') && other) {
          next = [...next.filter((s) => !s.startsWith('Другое:')), `Другое: ${other}`];
        } else {
          next = next.filter((s) => !s.startsWith('Другое:'));
        }
      }
      onChange(next);
    };

    const updateOtherText = (text: string) => {
      let next = [...selected];
      next = next.filter((s) => !s.startsWith('Другое:'));
      if (text.trim()) {
        if (!next.includes('Другое')) next.push('Другое');
        next.push(`Другое: ${text.trim()}`);
      }
      onChange(next);
    };

    return (
      <div className="form-group">
        <label className={`form-label ${required ? 'form-label--required' : ''}`}>{text}</label>
        <div className="checkbox-group">
          {options.map((option) => (
            <label key={option} className="checkbox-item">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(e) => updateMultiple(option, e.target.checked)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {type === 'multiple-with-other' && hasOther && (
          <input
            type="text"
            className="form-input"
            dir="ltr"
            style={{ marginTop: '0.75rem' }}
            placeholder="Укажите свой вариант"
            value={otherText}
            onChange={(e) => updateOtherText(e.target.value)}
          />
        )}
        {hint && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  return null;
}
