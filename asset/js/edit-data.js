function openEditModal(article) {
    $('#editId').val(article.id);
    $('#editTitle').val(article.title);
    $('#editContent').val(article.content);
    $('#editCategory').val(article.category);
    $('#editStatus').val(article.status);
    $('#editModal').modal('show');
}

function updateArticle() {
    const id = $('#editId').val();
    const data = {
        id: id,
        title: $('#editTitle').val(),
        content: $('#editContent').val(),
        category: $('#editCategory').val(),
        status: $('#editStatus').val()
    };

    fetch(`http://localhost:2025/article/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('nur:r1zk1')
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Data berhasil diperbarui');
            $('#editModal').modal('hide');
            fetchArticles(currentLimit, currentPage); // reload table
        } else {
            alert(result.message);
        }
    })
    .catch(err => {
        alert('Gagal update data: ' + err.message);
    });
}
