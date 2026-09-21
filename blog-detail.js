const blogDetail = document.getElementById("blogDetail");

if (blogDetail) {
    const API_BASE_URL = "http://127.0.0.1:8000";
    const slug = new URLSearchParams(window.location.search).get("slug");

    async function loadBlogDetail() {
        if (!slug) {
            showBlogError("Blog article not found.");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}/`,
            );

            if (!response.ok) {
                throw new Error("Blog not found");
            }

            const blog = await response.json();

            const imageUrl = blog.featured_image || "";

            console.log("IMAGE URL:", imageUrl);

            const publishedDate = blog.published_at
                ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                  })
                : "";

            document.title = `${blog.title} | The Digital Saathi`;

            blogDetail.innerHTML = `
                ${
                    imageUrl
                        ? `
                    <div class="blog-detail-cover ">
                        <img
                            src="${imageUrl}"
                            alt="${escapeHtml(blog.title)}"
                        >
                    </div>
                `
                        : ""
                }

                <div class="blog-detail-meta">
                    Digital Growth${publishedDate ? ` · ${publishedDate}` : ""}
                </div>

                <h1 class="blog-detail-title">
                    ${escapeHtml(blog.title)}
                </h1>

                <div class="blog-detail-content">
                    ${
                        (blog.content || "")
                            .split(/\n\s*\n/)
                            .filter(paragraph => paragraph.trim())
                            .map(paragraph => `<p>${escapeHtml(paragraph.trim())}</p>`)
                            .join("")
                    }
                </div>

                <div class="mt-5 pt-4">
                    <a class="fw-bold" href="blog.html">
                        <i class="bi bi-arrow-left me-1"></i>
                        Back to Blogs
                    </a>
                </div>
            `;
        } catch (error) {
            console.error("Blog Detail API Error:", error);
            showBlogError("Unable to load this article.");
        }
    }

    function showBlogError(message) {
        blogDetail.innerHTML = `
            <div class="blog-detail-error">
                <h2>${message}</h2>

                <p class="mt-3">
                    The article may have been removed or is not published yet.
                </p>

                <a class="btn btn-brand mt-3" href="blog.html">
                    Back to Blogs
                </a>
            </div>
        `;
    }

    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value || "";
        return div.innerHTML;
    }

    loadBlogDetail();
}
