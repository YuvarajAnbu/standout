import React, { useEffect } from "react";

function PrivatePolicy() {
  useEffect(() => {
    document.title = "Private Policy | Stand Out";
  }, []);

  return (
    <div className="footer__t-c">
      <h1>Private Policy</h1>

      <p>Please read Privacy Policy</p>
      <h2>Reservation of Rights</h2>

      <p>
        We reserve the right to request that you remove all links or any
        particular link to our Website. You approve to immediately remove all
        links to our Website upon request. We also reserve the right to amen
        these terms and conditions and it’s linking policy at any time. By
        continuously linking to our Website, you agree to be bound to and follow
        these linking terms and conditions.
      </p>
      <h2>Removal of links from our website</h2>

      <p>
        If you find any link on our Website that is offensive for any reason,
        you are free to contact and inform us any moment. We will consider
        requests to remove links but we are not obligated to or so or to respond
        to you directly.
      </p>

      <p>
        We do not ensure that the information on this website is correct, we do
        not warrant its completeness or accuracy; nor do we promise to ensure
        that the website remains available or that the material on the website
        is kept up to date.
      </p>
      <h2>Disclaimer</h2>

      <p>
        To the maximum extent permitted by applicable law, we exclude all
        representations, warranties and conditions relating to our website and
        the use of this website. Nothing in this disclaimer will:
      </p>
      <ul>
        <li>
          limit or exclude our or your liability for death or personal injury;
        </li>
        <li>
          limit or exclude our or your liability for fraud or fraudulent
          misrepresentation;
        </li>
        <li>
          limit any of our or your liabilities in any way that is not permitted
          under applicable law; or
        </li>
        <li>
          exclude any of our or your liabilities that may not be excluded under
          applicable law.
        </li>
      </ul>

      <p>
        The limitations and prohibitions of liability set in this Section and
        elsewhere in this disclaimer: (a) are subject to the preceding
        paragraph; and (b) govern all liabilities arising under the disclaimer,
        including liabilities arising in contract, in tort and for breach of
        statutory duty.
      </p>

      <p>
        As long as the website and the information and services on the website
        are provided free of charge, we will not be liable for any loss or
        damage of any nature.
      </p>
    </div>
  );
}

export default PrivatePolicy;
