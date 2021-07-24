//FUNCTION FOR IMPROVING THE UX

export default function renderLoading(isLoading, selector) {
  if (isLoading) {
    selector.textContent = "Saving...";
  } else {
    selector.textContent = "Save";
  }
}





