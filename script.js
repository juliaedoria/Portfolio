
/* =========================================
   1. PERSONAL INFORMATION
   Update these values before publishing.
========================================= */

const portfolioDetails = {
    email: "edoriajulia8@gmail.com",
    github: "https://github.com/juliaedoria",
    linkedin: "https://www.linkedin.com/in/julia-nina-edoria-b30121356/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BhwzP%2BYoxS7%2Bfrna1iGvYfA%3D%3D"
};


/* =========================================
   2. AUTOMATIC COPYRIGHT YEAR
========================================= */

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   3. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });
}


/* =========================================
   4. APPLY CONTACT INFORMATION
========================================= */

function setEmailLink(element, email) {
    if (!element) return;

    element.textContent = email;
    element.href = `mailto:${email}`;
}

const businessEmail = document.getElementById("business-email");
const contactEmail = document.getElementById("contact-email");
const githubLink = document.getElementById("github-link");
const linkedinLink = document.getElementById("linkedin-link");

setEmailLink(businessEmail, portfolioDetails.email);

if (contactEmail) {
    contactEmail.href = `mailto:${portfolioDetails.email}`;
}

if (githubLink) {
    githubLink.href = portfolioDetails.github;
}

if (linkedinLink) {
    linkedinLink.href = portfolioDetails.linkedin;
}


/* =========================================
   5. OPTIONAL PROFILE PHOTO
========================================= */

const profilePhoto = document.getElementById("profile-photo");
const photoPlaceholder = document.getElementById("photo-placeholder");

if (profilePhoto && photoPlaceholder) {
    profilePhoto.addEventListener("load", () => {
        profilePhoto.hidden = false;
        photoPlaceholder.hidden = true;
    });

    profilePhoto.addEventListener("error", () => {
        profilePhoto.hidden = true;
        photoPlaceholder.hidden = false;
    });

    // Recheck the image if it is already cached.
    if (profilePhoto.complete && profilePhoto.naturalWidth > 0) {
        profilePhoto.hidden = false;
        photoPlaceholder.hidden = true;
    }
}


/* =========================================
   6. QR BUSINESS CARD
========================================= */

const qrImage = document.getElementById("qr-image");
const qrPlaceholder = document.getElementById("qr-placeholder");
const qrStatus = document.getElementById("qr-status");
const qrDownload = document.getElementById("download-qr");
const portfolioAddress = document.getElementById("portfolio-address");

let qrImageUrl = "";
let qrReady = false;

function prepareQrCode() {
    // A local file URL is not suitable for a public business card.
    const isPublished =
        window.location.protocol === "https:" ||
        window.location.protocol === "http:";

    if (!isPublished || window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1") {
        if (portfolioAddress) {
            portfolioAddress.textContent = "Available after publishing";
        }

        if (qrStatus) {
            qrStatus.textContent =
                "Publish your website first to create a shareable QR code.";
        }

        return;
    }

    const publicUrl = window.location.href.split("#")[0];

    if (portfolioAddress) {
        portfolioAddress.textContent = window.location.host;
    }

    if (portfolioDetails.email !== "YOUR_EMAIL@example.com") {
        setEmailLink(businessEmail, portfolioDetails.email);
    }

    // This external service generates a QR image from the public URL.
    qrImageUrl =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=300x300&data=" + encodeURIComponent(publicUrl);

    qrImage.addEventListener("load", () => {
        qrReady = true;
        qrImage.hidden = false;
        qrPlaceholder.hidden = true;
        qrDownload.disabled = false;

        if (qrStatus) {
            qrStatus.textContent = "Your portfolio QR code is ready.";
        }
    });

    qrImage.addEventListener("error", () => {
        qrReady = false;
        qrImage.hidden = true;
        qrPlaceholder.hidden = false;
        qrDownload.disabled = true;

        if (qrStatus) {
            qrStatus.textContent =
                "The QR image could not load. Check your internet connection and refresh.";
        }
    });

    qrImage.src = qrImageUrl;
}

if (qrImage && qrPlaceholder && qrDownload) {
    prepareQrCode();

    qrDownload.addEventListener("click", async () => {
        if (!qrReady || !qrImageUrl) return;

        try {
            const response = await fetch(qrImageUrl);

            if (!response.ok) {
                throw new Error("Unable to retrieve QR image.");
            }

            const imageBlob = await response.blob();
            const temporaryUrl = URL.createObjectURL(imageBlob);
            const downloadLink = document.createElement("a");

            downloadLink.href = temporaryUrl;
            downloadLink.download = "Julia-Edoria-Portfolio-QR.png";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();

            URL.revokeObjectURL(temporaryUrl);
        } catch (error) {
            // Fallback: open the QR image so it can be saved manually.
            window.open(qrImageUrl, "_blank", "noopener,noreferrer");

            if (qrStatus) {
                qrStatus.textContent =
                    "The image opened in a new tab. Save it from there.";
            }
        }
    });
}
