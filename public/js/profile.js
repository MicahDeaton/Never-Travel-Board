const newFormHandler = async (event) => {
  event.preventDefault();

  const board_name = document.querySelector('#board-name').value.trim();
  const board_description = document.querySelector('#board-desc').value.trim();

  console.log('submit formhandler: ', board_name, board_description);

  if (board_name && board_description) {
    const response = await fetch(`/api/boards`, {
      method: 'POST',
      body: JSON.stringify({ board_name, board_description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    let response;
    // delete the board
    if (event.target.classList.contains('deleteboard')) {
      response = await fetch(`/api/boards/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete board');
      }
      // select the board and redirect to the board-specific page
    } else if (event.target.classList.contains('selectboard')) {
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
  .querySelector('.new-board-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.board-list')
  .addEventListener('click', delButtonHandler);
