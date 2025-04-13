function insertArticle(e) {
    e.preventDefault();

    const data = {
        title: document.getElementById('txt-title').value,
        content: document.getElementById('txt-content').value,
        category: document.getElementById('txt-category').value,
        status: document.getElementById('opt-status').value
    };

    fetch('http://localhost:2025/article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('nur:r1zk1')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Artikel berhasil ditambahkan!');
            $('#insertModal').modal('hide');
            fetchArticles(currentLimit, currentPage);
            document.getElementById('insertArticleForm').reset();
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        alert('Terjadi kesalahan saat menambahkan data: ' + error.message);
        console.error(error);
    });
};
