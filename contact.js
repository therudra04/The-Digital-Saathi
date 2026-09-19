const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            service: formData.get("service"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/contact/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Your enquiry has been sent successfully.");
                contactForm.reset();
            } else {
                console.error(result);
                alert("Please check your details and try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    });
}
