const Input = ({ label, error, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-typography-700 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`input-field ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : ''}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-error-600">{error}</p>
            )}
        </div>
    );
};

export default Input;
