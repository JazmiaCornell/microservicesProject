import church from "../images/church.jpg"; // import image

function About() {
  return (
    <section className="relative h-screen bg-white px-10 pt-10">
      <div className="relative w-[90%] h-[90%] mx-auto bg-grey rounded-xl flex items-center justify-between px-10">
        <div className="max-w-xl text-center p-10">
          <h1 className="text-7xl font-extrabold font-heading leading-tight">
            About Us
          </h1>
          <h2 className="font-heading font-normal text-3xl">Our Mission</h2>
          <p className="mt-2 text-xl text-800 text-justify">
            To spread love. <br /> It&#39;s simple, but powerful. Through
            worship, service, fellowship, and outreach, we aim to reflect
            God&#39;s love in all aspects of our lives. Whether it&#39;s lending
            a helping hand, offering a listening ear, or creating space for
            spiritual growth, our church family is here to love and be loved.{" "}
            <br />
            Serving our community is a core part of who we are. We partner with
            local shelters, schools, and food banks to provide meals, clothing,
            and essential support to those in need. We organize neighborhood
            clean-up days, host free community events, and offer resources for
            families facing hardship. We believe that when we uplift our
            neighbors, we reflect the heart of Christ—and together, we build a
            stronger, more compassionate community.
          </p>
        </div>

        {/* image of church */}
        <div className="max-w-xl">
          <img
            src={church}
            alt="a church"
            className="w-full h-full object-cover transform scale-95 rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
