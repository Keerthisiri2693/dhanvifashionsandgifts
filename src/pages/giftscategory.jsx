import { Link } from "react-router-dom";
import "./giftscategory.css";

import birthday from "../assets/birthday.jpg";
import wedding from "../assets/wedding.jpg";
import babyshower from "../assets/babyshower.jpg";
import housewarming from "../assets/housewarming.jpg";
import festival from "../assets/festival.jpg";
import corporate from "../assets/corporate.png";

function ReturnGifts() {

  const subcategories = [
    {
      name: "Birthday Gifts 🎂",
      image: birthday,
      link: "/shop?subcategory=birthday"
    },
    {
      name: "Wedding Gifts 💍",
      image: wedding,
      link: "/shop?subcategory=wedding"
    },
    {
      name: "Baby Shower Gifts 👶",
      image: babyshower,
      link: "/shop?subcategory=baby"
    },
    {
      name: "Housewarming Gifts 🏠",
      image: housewarming,
      link: "/shop?subcategory=house"
    },
    {
      name: "Festival Gifts 🎉",
      image: festival,
      link: "/shop?subcategory=festival"
    },
    {
      name: "Corporate Gifts 🎁",
      image: corporate,
      link: "/shop?subcategory=corporate"
    }
  ];

  return (
    <div className="returngifts-page">

      <h1 className="returngifts-title">Return Gift Categories 🎁</h1>

      <div className="returngifts-container">

        {subcategories.map((cat, index) => (

          <Link key={index} to={cat.link} className="returngift-card">

            <img src={cat.image} alt={cat.name} />

            <div className="returngift-content">
              <h3>{cat.name}</h3>
              <span className="returngift-btn">Shop Now</span>
            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}

export default ReturnGifts;