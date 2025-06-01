import church from "../images/church.jpg"; // import image

function About() {
  return (
    <section className="relative min-h-screen bg-white px-4 pt-10 sm:px-10">
      <div className="relative w-full max-w-7xl h-[90vh] mx-auto bg-grey rounded-xl flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 gap-8">
        <div className="max-w-xl text-center sm:text-left p-6 sm:p-10">
          <h1 className="text-4xl font-extrabold font-heading leading-tight sm:text-7xl ">
            About Us
          </h1>
          <h2 className="font-heading font-normal text-2xl sm:text-3xl mt-4">
            Our Mission
          </h2>
          <p className="mt-2 text-base sm:text-xl text-800 text-justify">
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
