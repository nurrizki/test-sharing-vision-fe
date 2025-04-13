function deleteArticle(id) {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;

    fetch(`http://localhost:2025/article/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Basic ' + btoa('nur:r1zk1')
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Artikel berhasil dihapus.');
            fetchArticles(currentLimit, currentPage);
        } else {
            alert('Gagal menghapus: ' + result.message);
        }
    })
    .catch(error => {
        alert('Terjadi kesalahan saat menghapus data: ' + error.message);
        console.error(error);
    });
}
