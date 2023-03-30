export const throttle = () => {
  let id: number | null = null;
  return (cb: () => void) => {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(() => {
      cb();
    }, 400);
  };
};
