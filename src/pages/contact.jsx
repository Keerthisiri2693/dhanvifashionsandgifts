import "./contact.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Contact() {


const handleSendMessage = async (e) => {

  e.preventDefault();

  try {

    // ================= FORM VALUES =================

    const name =
      e.target.name.value.trim();

    const email =
      e.target.email.value.trim();

    const phone =
      e.target.phone.value.trim();

    const userMessage =
      e.target.message.value.trim();

    // ================= VALIDATION =================

    if (!phone) {

      alert(
        "Please enter customer WhatsApp number"
      );

      return;
    }

    // ================= CLEAN NUMBER =================

    let cleanPhone =
      phone.replace(/\D/g, "");

    // ================= REMOVE COUNTRY CODE =================

    if (
      cleanPhone.startsWith("91") &&
      cleanPhone.length > 10
    ) {

      cleanPhone =
        cleanPhone.substring(2);
    }

    // ================= FINAL NUMBER =================

    const whatsappNumber =
      `91${cleanPhone}`;

    // ================= PRODUCTS =================

    const items = [

      {
        product: "Return Gift Box",
        qty: 2,
        price: 250,
      },

      {
        product: "Chocolate Pack",
        qty: 1,
        price: 150,
      },

    ];

    // ================= TOTAL =================

    const total =
      items.reduce(
        (sum, item) =>
          sum +
          (item.qty * item.price),
        0
      );

    // ================= ITEMS TEXT =================

    const itemsText =
      items.map((item, index) =>

        `${index + 1}. ${item.product}
Qty : ${item.qty}
Price : ₹${item.price}
Total : ₹${item.qty * item.price}`

      ).join("\n\n");

    // ================= BILL MESSAGE =================

    const billMessage =
`🧾 *DHANVI RETURN GIFTS*

📍 Chennai, Tamil Nadu
📞 +91 90952 49075

━━━━━━━━━━━━━━

🧑 Customer : ${name}
📧 Email : ${email}
📱 Phone : ${cleanPhone}

━━━━━━━━━━━━━━

📦 *PRODUCTS*

${itemsText}

━━━━━━━━━━━━━━

💰 *Grand Total : ₹${total}*

📝 Note :
${userMessage}

━━━━━━━━━━━━━━

🙏 Thank You Visit Again`;

    // ================= WHATSAPP URL =================

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        billMessage
      )}`;

    // ================= OPEN WHATSAPP =================

    window.open(
      whatsappUrl,
      "_blank"
    );

  } catch (err) {

    console.log(
      "WhatsApp Error:",
      err
    );

    alert(
      "Something went wrong"
    );
  }
};

  return (

    <div className="contact-page">

      <div className="contact-container">

        <h1>
          Contact Us
        </h1>

        <p className="contact-text">

          Have questions about our products or orders?

          Feel free to contact us anytime.

        </p>

        {/* CONTACT INFO */}

        <div className="contact-info">

          <p>
            <b>📞 Phone:</b>
            {" "}
            <a href="tel:+918526838993">
              +91 8526838993
            </a>
          </p>

          <p>
            <b>📧 Email:</b>
            {" "}
            <a href="mailto:dhanvireturngifts@gmail.com">
              dhanvireturngifts@gmail.com
            </a>
          </p>

          <p>
            <b>📍 Address:</b>
            Chennai, Tamil Nadu, India
          </p>

        </div>

        {/* FORM */}

        <form
          className="contact-form"
          onSubmit={handleSendMessage}
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
          />

<input
  type="tel"
  name="phone"
  placeholder="WhatsApp Number"
  required
/>
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
}

export default Contact;