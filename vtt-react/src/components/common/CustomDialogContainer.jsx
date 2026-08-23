import React from 'react';
import useDialogStore from '../../store/dialogStore';
import CustomDialog from './CustomDialog';

const CustomDialogContainer = () => {
  const dialogs = useDialogStore((state) => state.dialogs);
  const closeDialog = useDialogStore((state) => state.closeDialog);

  if (!dialogs || dialogs.length === 0) {
    return null;
  }

  return (
    <div className="custom-dialogs-root">
      {dialogs.map((dialog) => (
        <CustomDialog
          key={dialog.id}
          dialog={dialog}
          onClose={closeDialog}
        />
      ))}
    </div>
  );
};

export default CustomDialogContainer;
