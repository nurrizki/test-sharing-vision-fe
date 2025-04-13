let articleData = [];
let currentLimit = 10;
let currentPage = 1;
let maxPage = 1;
let debounceTimer;

// Step 1: Ambil data dulu secara manual
function fetchArticles(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const url = 'http://localhost:2025/article';
    const field = document.getElementById('searchField').value;
    const keyword = document.getElementById('searchKeyword').value;
    const params = {
        limit: limit,
        offset: offset
    };
    params[field] = keyword;

    // Mengubah objek params menjadi query string
    const queryString = new URLSearchParams(params).toString();

    // Fetch data dengan query string di URL
    fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('nur:r1zk1') // Basic Auth (optional)
        },
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.status === "failed") {
            alert(data.message); 
        }
        if (data.status == "success") {
            articleData = data.data;
            currentLimit = data.pagination.limit;
            currentPage = data.pagination.page;
            maxPage = data.pagination.maxPage;

            const start = offset + 1;
            const end = offset + data.pagination.rowCount;
            const total = data.pagination.totalRowCount;

            $('#customInfo').text(`Showing ${start} to ${end} of ${total} entries`);

            const table = $('#articleTable').DataTable();
            table.clear().rows.add(articleData).draw();
        }

    })
    .catch(error => {
        alert("Something went wrong: " + error.message);
        console.error('Error:', error);
    });
}

$(document).ready(function () {
    const table = $('#articleTable').DataTable({
        paging: false,
        info: false,
        searching:false,
        data: articleData,
        columns: [
            { 
                data: 'title',
                render: function (data) {
                    return data.length > 30 ? data.slice(0, 30) + '...' : data;
                }
            },
            { data: 'category' },
            { data: 'status' },
            { 
                data: 'created_date',
                render: function (data) {
                    const date = new Date(data);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                return `
                    <button class="btn btn-sm btn-info" onclick="fetchArticleDetail(${row.id})"><i class="fas fa-info"></i></button>
                    <button class="btn btn-sm btn-warning" onclick='openEditModal(${JSON.stringify(row)})'><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteArticle(${row.id})"><i class="fas fa-trash"></i></button>
                `;
                }
            }
        ]
    });

    fetchArticles(currentLimit, currentPage);

    $('#prevPage').on('click', function () {
        if (currentPage > 1) fetchArticles(currentLimit, currentPage - 1);
    });

    $('#nextPage').on('click', function () {
        if (currentPage < maxPage) fetchArticles(currentLimit, currentPage + 1);
    });

    table.on('length.dt', function (e, settings, len) {
        currentLimit = len;
        fetchArticles(currentLimit, 1);
    });

    $('#limitSelect').on('change', function () {
        const newLimit = parseInt($(this).val());
        fetchArticles(newLimit, 1); // reset ke page 1
    });

});

function fetchArticleDetail(id) {
    fetch(`http://localhost:2025/article/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('nur:r1zk1')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {

            $("#modalDetail").modal('show');
            
            const article = data.data;

            $("#detailTitle").text(article.title);
            $("#detailCategory").text(article.category);
            $("#detailStatus").text(article.status);
            $("#detailContent").text(article.content);
            
            const createdDate = new Date(article.created_date);
            $("#detailCreatedDate").text(String(createdDate.getDate()).padStart(2, '0') + "-" + String(createdDate.getMonth() + 1).padStart(2, '0') + "-" + createdDate.getFullYear());
        } else {
            alert(data.message || "Failed to load article details.");
        }
    })
    .catch(error => {
        console.error("Error fetching article detail:", error);
        alert("Error fetching detail.");
    });
}