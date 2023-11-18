const selectBoardHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    let response;
    if (event.target.classList.contains('selectboard')) {
      event.preventDefault();
      response = await fetch(`/api/boards/select/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        document.location.replace(`/boards/${id}`);
      } else {
        alert('Failed to select board');
      }
    }
  }
};

document
  .querySelector('.board-list')
  .addEventListener('click', selectBoardHandler);
