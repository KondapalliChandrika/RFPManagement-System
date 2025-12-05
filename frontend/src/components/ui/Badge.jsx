import { STATUS_LABELS, STATUS_COLORS } from '../../basemodules/utils/constants';

const Badge = ({ status }) => {
    const colorClasses = {
        gray: 'badge-draft',
        blue: 'badge-sent',
        green: 'badge-received',
        yellow: 'bg-warning-100 text-warning-700',
        red: 'bg-error-100 text-error-700',
    };

    const color = STATUS_COLORS[status] || 'gray';
    const label = STATUS_LABELS[status] || status;

    return (
        <span className={`badge ${colorClasses[color]}`}>
            {label}
        </span>
    );
};

export default Badge;
