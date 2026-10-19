import { Link } from "react-router-dom";
import { PageHero } from "../components/Sections";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="This rung doesn't exist.">
        The page you're looking for has moved or never existed.
      </PageHero>
      <section className="section">
        <div className="container">
          <Link to="/" className="btn btn-primary">Back to home</Link>
        </div>
      </section>
    </>
  );
}
