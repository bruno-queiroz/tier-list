export const throttle = () => {
  let id: NodeJS.Timeout | undefined = undefined;
  return (cb: () => void) => {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(() => {
      cb();
    }, 400);
  };
};
