export const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};
