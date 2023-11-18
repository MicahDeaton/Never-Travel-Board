const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#board-name').value.trim();
  const description = document.querySelector('#board-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/api/boards`, {
      method: 'POST',
      body: JSON.stringify({ name, needed_funding, description }),
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

    const response = await fetch(`/api/boards/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

document
  .querySelector('.new-board-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.board-list')
  .addEventListener('click', delButtonHandler);
