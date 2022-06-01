import { useState } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggleClientModal() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggleClientModal,
  }
};

export default useModal;