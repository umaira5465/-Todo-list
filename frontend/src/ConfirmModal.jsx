
function ConfirmModal({
  show,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  type
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-buttons">

          {onCancel && (
            <button
              className="cancel-btn"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}

          <button
            className={
              type === "delete"
                ? "confirm-delete-btn"
                : "confirm-edit-btn"
            }
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;
