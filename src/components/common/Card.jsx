import { cn } from '../../utils/classNames';

export const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={cn('card', className)}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

