const Button = ({ children, variant = 'primary', onClick, disabled, className = '', type = 'button' }) => {
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
