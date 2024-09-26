async function getTestimonialData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

async function showRating(star) {
  try {
    const testimonials = await getTestimonialData(
      "https://api.npoint.io/87f91b21bf44cb584853"
    );

    let testimonialsHTML = "";

    const filteredTestimonials = testimonials.filter((testimonial) => {
      return star === testimonial.rating;
    });

    filteredTestimonials.forEach((testimonial) => {
      testimonialsHTML += `
        <div class="col">
          <div class="card testimonial-card h-100 shadow">
            <img src="${testimonial.image}" class="card-img-top" alt="Testimonial image" />
            <div class="card-body d-flex flex-column">
              <p class="card-text flex-grow-1"><em>"${testimonial.comment}"</em></p>
              <p class="card-text text-end fw-bold mb-1">- ${testimonial.author}</p>
              <p class="card-text text-end fw-bold">
                ${testimonial.rating}
                <i class="fa-sharp fa-solid fa-star"></i>
              </p>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById("testimonial-deck").innerHTML = testimonialsHTML;
  } catch (error) {
    console.error("Error displaying ratings:", error);
  }
}

async function showAllRatings() {
  try {
    const testimonials = await getTestimonialData(
      "https://api.npoint.io/87f91b21bf44cb584853"
    );

    let testimonialsHTML = "";

    testimonials.forEach((testimonial) => {
      testimonialsHTML += `
        <div class="col">
          <div class="card testimonial-card h-100 shadow">
            <img src="${testimonial.image}" class="card-img-top" alt="Testimonial image" />
            <div class="card-body d-flex flex-column">
              <p class="card-text flex-grow-1"><em>"${testimonial.comment}"</em></p>
              <p class="card-text text-end fw-bold mb-1">- ${testimonial.author}</p>
              <p class="card-text text-end fw-bold">
                ${testimonial.rating}
                <i class="fa-sharp fa-solid fa-star"></i>
              </p>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById("testimonial-deck").innerHTML = testimonialsHTML;
  } catch (error) {
    console.error("Error displaying all ratings:", error);
  }
}

// Call the function to display all ratings
showAllRatings();
