import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      <div className="contact-container">

        <h1>Contact Us</h1>

        <p className="contact-text">
          Have questions about our products or orders?  
          Feel free to contact us anytime.
        </p>

        <div className="contact-info">

          <p><b>📞 Phone:</b> +91 98765 43210</p>

          <p><b>📧 Email:</b> dhanvireturngifts@gmail.com</p>

          <p><b>📍 Address:</b> Chennai, Tamil Nadu, India</p>

        </div>

        <form className="contact-form">

          <input type="text" placeholder="Your Name" required />

          <input type="email" placeholder="Your Email" required />

          <textarea placeholder="Your Message" rows="5"></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
}

export default Contact;