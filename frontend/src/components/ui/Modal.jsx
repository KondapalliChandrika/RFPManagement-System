import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-typography-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-outline-200">
                    <h2 className="text-2xl font-bold text-typography-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-typography-500 hover:text-typography-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
