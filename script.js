(() => {
    const root = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const saved = localStorage.getItem("ds-theme");
    if (saved) root.setAttribute("data-theme", saved);
    const updateThemeIcon = () => {
        if (!toggle) return;
        const dark = root.getAttribute("data-theme") === "dark";
        toggle.innerHTML = dark
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon-stars"></i>';
        toggle.setAttribute(
            "aria-label",
            dark ? "Switch to light mode" : "Switch to dark mode",
        );
        toggle.setAttribute(
            "title",
            dark ? "Switch to light mode" : "Switch to dark mode",
        );
    };
    updateThemeIcon();
    toggle?.addEventListener("click", () => {
        const dark = root.getAttribute("data-theme") !== "dark";
        root.setAttribute("data-theme", dark ? "dark" : "light");
        localStorage.setItem("ds-theme", dark ? "dark" : "light");
        updateThemeIcon();
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    const back = document.getElementById("backToTop");
    if (back) {
        window.addEventListener(
            "scroll",
            () => back.classList.toggle("show", window.scrollY > 600),
            { passive: true },
        );
        back.addEventListener("click", () =>
            window.scrollTo({ top: 0, behavior: "smooth" }),
        );
    }

    document
        .querySelectorAll("#mainNav .nav-link, #mainNav .dropdown-item")
        .forEach((link) =>
            link.addEventListener("click", () => {
                const nav = document.getElementById("mainNav");
                if (nav?.classList.contains("show"))
                    bootstrap.Collapse.getOrCreateInstance(nav).hide();
            }),
        );
})();

document.querySelectorAll(".dropdown-menu .dropdown-item").forEach((link) => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});

// ===============================
// BLOG API
// ===============================

// ===============================
// BLOG API
// ===============================

const blogsContainer = document.getElementById("blogsContainer");

if (blogsContainer) {
    const API_URL = "http://127.0.0.1:8000/api/blogs/";

    async function loadBlogs() {
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const blogs = await response.json();

            console.log("Blogs received:", blogs);

            blogsContainer.innerHTML = "";

            if (!blogs.length) {
                blogsContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <p>No blogs published yet.</p>
                    </div>
                `;
                return;
            }

            blogs.forEach((blog, index) => {
                const imageUrl = blog.featured_image || "";

                const cleanContent = blog.content
                    ? blog.content.replace(/<[^>]*>/g, "")
                    : "";

                const excerpt =
                    cleanContent.length > 150
                        ? cleanContent.substring(0, 150) + "..."
                        : cleanContent;

                const publishedDate = blog.published_at
                    ? new Date(blog.published_at).getFullYear()
                    : "";

                blogsContainer.innerHTML += `
                    <div class="col-md-6 col-lg-4">

                        <article class="blog-card">

                            <div class="blog-cover">
    ${
        imageUrl
            ? `
                <img
                    src="${imageUrl}"
                    alt="${blog.title}"
                    class="blog-image"
                >
            `
            : `<span>BLOG</span>`
    }
</div>

                            <div class="blog-body">

                                <div class="blog-meta mb-3">
                                    Digital Growth · ${publishedDate}
                                </div>

                                <h3>
                                    ${blog.title}
                                </h3>

                                <p>
                                    ${excerpt}
                                </p>

                                <a
                                    class="fw-bold"
                                    href="blog-detail.html?slug=${encodeURIComponent(blog.slug)}"
                                >
                                    Read article
                                    <i class="bi bi-arrow-up-right ms-1"></i>
                                </a>

                            </div>

                        </article>

                    </div>
                `;
            });
        } catch (error) {
            console.error("Blog API Error:", error);

            blogsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p>Unable to load blogs right now.</p>
                </div>
            `;
        }
    }

    loadBlogs();
}
