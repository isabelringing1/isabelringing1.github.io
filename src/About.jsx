import flower from "/flower.png";

export default function About(props) {
  return (
    <div id="about">
      <div className="about-text">
        isabel
        <img className="flower" src={flower} /> is a creative technologist based
        in NYC.
      </div>

      <div className="about-text top-margin">stalk more:</div>
      <a
        className="about-text faded"
        href="https://x.com/isabisabel_"
        target="_blank"
      >
        twitter
      </a>
      <div>
        <a
          className="about-text faded"
          href="https://isabellee.me/"
          target="_blank"
        >
          portfolio
        </a>
      </div>
      <div>
        <a
          className="about-text faded"
          href="mailto:isabelringing1@gmail.com"
          target="_blank"
        >
          contact
        </a>
      </div>
    </div>
  );
}
